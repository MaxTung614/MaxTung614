// GameTopUp client script

/** @typedef {{id: string, name: string, category: string, servers?: string[], denominations: {id: string, label: string, price: number, currency: string}[], logo?: string}} Game */

(function () {
  "use strict";

  /** @type {Game[]} */
  let allGames = [];
  let selectedGameId = "";
  let selectedDenominationId = "";

  // DOM elements
  const els = {
    year: document.getElementById("year"),
    gameSearch: document.getElementById("gameSearch"),
    gamesGrid: document.getElementById("gamesGrid"),
    form: document.getElementById("topupForm"),
    gameSelect: document.getElementById("gameSelect"),
    serverSelect: document.getElementById("serverSelect"),
    uidInput: document.getElementById("playerUid"),
    denomSelect: document.getElementById("denominationSelect"),
    emailInput: document.getElementById("emailInput"),
    paymentMethod: document.getElementById("paymentMethod"),
    priceDisplay: document.getElementById("priceDisplay"),
    // summary
    summary: document.getElementById("orderSummary"),
    sumOrderId: document.getElementById("sumOrderId"),
    sumGame: document.getElementById("sumGame"),
    sumServer: document.getElementById("sumServer"),
    sumUid: document.getElementById("sumUid"),
    sumDenom: document.getElementById("sumDenom"),
    sumTotal: document.getElementById("sumTotal"),
    sumEmail: document.getElementById("sumEmail"),
    sumPayment: document.getElementById("sumPayment"),
    copySummary: document.getElementById("copySummary"),
    newOrder: document.getElementById("newOrder"),
  };

  if (els.year) {
    els.year.textContent = String(new Date().getFullYear());
  }

  // Utilities
  function formatCurrency(amount, currency) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
    } catch (_) {
      return `$${amount.toFixed(2)}`;
    }
  }

  function generateOrderId() {
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `GTU-${stamp}-${rand}`;
  }

  function getGameById(id) {
    return allGames.find((g) => g.id === id);
  }

  function getDenomination(game, denomId) {
    return game.denominitions?.find((d) => d.id === denomId) || game.denominations.find((d) => d.id === denomId);
  }

  // Render game cards
  function renderGames(games) {
    if (!els.gamesGrid) return;
    els.gamesGrid.innerHTML = "";
    const fragment = document.createDocumentFragment();
    games.forEach((game) => {
      const card = document.createElement("article");
      card.className = "game-card";

      const head = document.createElement("div");
      head.className = "game-head";
      const avatar = document.createElement("div");
      avatar.className = "avatar";
      avatar.textContent = (game.name || "?").charAt(0).toUpperCase();
      const titleBox = document.createElement("div");
      const name = document.createElement("h3");
      name.className = "game-name";
      name.textContent = game.name;
      const cat = document.createElement("div");
      cat.className = "game-cat";
      cat.textContent = game.category;
      titleBox.appendChild(name);
      titleBox.appendChild(cat);
      head.appendChild(avatar);
      head.appendChild(titleBox);

      const denoms = document.createElement("div");
      denoms.className = "denoms";
      game.denominations.slice(0, 4).forEach((d) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = `${d.label} · ${formatCurrency(d.price, d.currency)}`;
        denoms.appendChild(chip);
      });

      const actions = document.createElement("div");
      actions.className = "card-actions";
      const priceHint = document.createElement("div");
      priceHint.className = "game-cat";
      priceHint.textContent = `from ${formatCurrency(game.denominations[0].price, game.denominations[0].currency)}`;
      const button = document.createElement("button");
      button.className = "btn btn-primary topup-btn";
      button.type = "button";
      button.textContent = "Top up";
      button.addEventListener("click", () => selectGameAndScroll(game.id));
      actions.appendChild(priceHint);
      actions.appendChild(button);

      card.appendChild(head);
      card.appendChild(denoms);
      card.appendChild(actions);
      fragment.appendChild(card);
    });
    els.gamesGrid.appendChild(fragment);
  }

  // Populate form selects
  function populateGameSelect() {
    if (!els.gameSelect) return;
    els.gameSelect.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Select a game";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    els.gameSelect.appendChild(defaultOpt);
    allGames.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name;
      els.gameSelect.appendChild(opt);
    });
  }

  function populateServers(game) {
    if (!els.serverSelect) return;
    els.serverSelect.innerHTML = "";
    const servers = Array.isArray(game.servers) && game.servers.length ? game.servers : ["Global"];
    servers.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      els.serverSelect.appendChild(opt);
    });
  }

  function populateDenominations(game) {
    if (!els.denomSelect) return;
    els.denomSelect.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Select amount";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    els.denomSelect.appendChild(defaultOpt);
    game.denominations.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.label} — ${formatCurrency(d.price, d.currency)}`;
      els.denomSelect.appendChild(opt);
    });
  }

  function updatePriceDisplay() {
    if (!els.priceDisplay) return;
    const game = getGameById(selectedGameId);
    if (!game) {
      els.priceDisplay.textContent = "—";
      return;
    }
    const denom = game.denominations.find((d) => d.id === selectedDenominationId);
    if (!denom) {
      els.priceDisplay.textContent = "—";
      return;
    }
    els.priceDisplay.textContent = formatCurrency(denom.price, denom.currency);
  }

  function selectGameAndScroll(gameId) {
    selectedGameId = gameId;
    if (els.gameSelect) {
      els.gameSelect.value = gameId;
      els.gameSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    document.getElementById("topup")?.scrollIntoView({ behavior: "smooth" });
  }

  // Validation helpers
  function isValidEmail(value) {
    return /.+@.+\..+/.test(value);
  }

  function showSummary(order) {
    if (!els.summary) return;
    els.sumOrderId.textContent = order.id;
    els.sumGame.textContent = order.gameName;
    els.sumServer.textContent = order.server;
    els.sumUid.textContent = order.uid;
    els.sumDenom.textContent = order.denomLabel;
    els.sumTotal.textContent = order.totalFormatted;
    els.sumEmail.textContent = order.email;
    els.sumPayment.textContent = order.payment;
    els.summary.hidden = false;
    els.summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function resetSummary() {
    if (!els.summary) return;
    els.summary.hidden = true;
  }

  // Event wiring
  function wireEvents() {
    if (els.gameSearch) {
      els.gameSearch.addEventListener("input", (e) => {
        const q = String(e.target.value || "").trim().toLowerCase();
        const filtered = q
          ? allGames.filter((g) =>
              g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
            )
          : allGames;
        renderGames(filtered);
      });
    }

    if (els.gameSelect) {
      els.gameSelect.addEventListener("change", () => {
        const game = getGameById(els.gameSelect.value);
        if (!game) return;
        selectedGameId = game.id;
        populateServers(game);
        populateDenominations(game);
        selectedDenominationId = "";
        updatePriceDisplay();
        resetSummary();
      });
    }

    if (els.denomSelect) {
      els.denomSelect.addEventListener("change", () => {
        selectedDenominationId = els.denomSelect.value;
        updatePriceDisplay();
        resetSummary();
      });
    }

    if (els.uidInput) {
      els.uidInput.addEventListener("input", () => {
        // Keep only digits
        els.uidInput.value = els.uidInput.value.replace(/\D+/g, "");
      });
    }

    if (els.form) {
      els.form.addEventListener("submit", (e) => {
        e.preventDefault();
        const game = getGameById(els.gameSelect.value);
        const server = els.serverSelect.value;
        const uid = els.uidInput.value.trim();
        const denom = game?.denominations.find((d) => d.id === els.denomSelect.value);
        const email = els.emailInput.value.trim();
        const payment = els.paymentMethod.options[els.paymentMethod.selectedIndex]?.text || "";

        let valid = true;
        if (!game) { valid = false; els.gameSelect.focus(); }
        else if (!server) { valid = false; els.serverSelect.focus(); }
        else if (!uid || uid.length < 3) { valid = false; els.uidInput.focus(); }
        else if (!denom) { valid = false; els.denomSelect.focus(); }
        else if (!isValidEmail(email)) { valid = false; els.emailInput.focus(); }

        if (!valid) {
          // Could show inline messages; keep lightweight here
          return;
        }

        const order = {
          id: generateOrderId(),
          gameId: game.id,
          gameName: game.name,
          server,
          uid,
          denomId: denom.id,
          denomLabel: denom.label,
          total: denom.price,
          totalFormatted: formatCurrency(denom.price, denom.currency),
          email,
          payment,
        };
        showSummary(order);
      });
    }

    if (els.copySummary) {
      els.copySummary.addEventListener("click", async () => {
        const lines = [
          `Order ${els.sumOrderId.textContent}`,
          `Game: ${els.sumGame.textContent}`,
          `Server: ${els.sumServer.textContent}`,
          `UID: ${els.sumUid.textContent}`,
          `Denomination: ${els.sumDenom.textContent}`,
          `Total: ${els.sumTotal.textContent}`,
          `Email: ${els.sumEmail.textContent}`,
          `Payment: ${els.sumPayment.textContent}`,
        ];
        const text = lines.join("\n");
        try {
          await navigator.clipboard.writeText(text);
          els.copySummary.textContent = "Copied!";
          setTimeout(() => (els.copySummary.textContent = "Copy details"), 1200);
        } catch (_) {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
      });
    }

    if (els.newOrder) {
      els.newOrder.addEventListener("click", () => {
        els.form.reset();
        selectedGameId = "";
        selectedDenominationId = "";
        populateGameSelect();
        updatePriceDisplay();
        resetSummary();
        document.getElementById("topup")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  // Bootstrap
  async function init() {
    wireEvents();
    try {
      const res = await fetch("./assets/data/games.json", { cache: "no-cache" });
      allGames = await res.json();
      // sort by name
      allGames.sort((a, b) => a.name.localeCompare(b.name));
      renderGames(allGames);
      populateGameSelect();
    } catch (err) {
      console.error("Failed to load games.json", err);
      if (els.gamesGrid) {
        els.gamesGrid.innerHTML = `<div class="game-cat">Failed to load games. Please serve this site over HTTP(s).</div>`;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();

