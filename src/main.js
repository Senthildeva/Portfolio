(function () {
  "use strict";
  var doc = document, body = doc.body;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var store = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- splash: once per browser session, landing page only ---------- */
  var splash = doc.getElementById("splash");
  if (splash) {
    if (store.get("sd-splash") || reduce) {
      splash.remove();
    } else {
      store.set("sd-splash", "1");
      body.classList.add("no-scroll");
      var words = splash.querySelectorAll(".splash-word");
      var finish = function () {
        if (!splash.isConnected) return;
        splash.classList.add("done");
        body.classList.remove("no-scroll");
        setTimeout(function () { splash.remove(); }, 500);
      };
      var step = 0;
      var next = function () {
        if (step > 0) words[step - 1].classList.replace("show", "leave");
        if (step < words.length) { words[step].classList.add("show"); step++; setTimeout(next, step === 1 ? 1100 : 900); }
        else { splash.classList.add("wipe"); setTimeout(finish, 700); }
      };
      setTimeout(next, 200);
      var skip = splash.querySelector(".skip-splash");
      if (skip) skip.addEventListener("click", finish);
    }
  }

  /* ---------- nav ---------- */
  var nav = doc.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    var burger = nav.querySelector(".nav-burger");
    if (burger) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
      doc.addEventListener("click", function (e) { if (!nav.contains(e.target)) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
    }
  }

  /* ---------- say hi panel ---------- */
  var panel = doc.getElementById("say-hi");
  var lastFocus = null;
  function openHi(e) {
    if (e) e.preventDefault();
    if (!panel) return;
    lastFocus = doc.activeElement;
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () { body.classList.add("hi-open", "no-scroll"); });
    if (nav) nav.classList.remove("open");
    setTimeout(function () { var f = panel.querySelector("#hi-name"); if (f) f.focus({ preventScroll: true }); }, 350);
  }
  function closeHi() {
    if (!panel) return;
    body.classList.remove("hi-open", "no-scroll");
    panel.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  doc.querySelectorAll("[data-say-hi]").forEach(function (b) { b.addEventListener("click", openHi); });
  doc.querySelectorAll("[data-close-hi]").forEach(function (b) { b.addEventListener("click", closeHi); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && body.classList.contains("hi-open")) closeHi(); });
  if (location.hash === "#say-hi") openHi();

  /* ---------- contact form ---------- */
  var form = doc.getElementById("hi-form");
  if (form) {
    var send = form.querySelector(".send");
    var msg = form.querySelector(".form-msg");
    var rules = {
      name: function (v) { return v.trim().length >= 2 ? "" : "Enter your name."; },
      phone: function (v) { var d = v.replace(/[^\d]/g, ""); return d.length >= 8 && d.length <= 15 ? "" : "Enter a valid mobile number."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."; },
      message: function (v) { return v.trim().length >= 5 ? "" : "Tell me a little more."; }
    };
    var check = function (show) {
      var ok = true;
      Object.keys(rules).forEach(function (k) {
        var input = form.elements[k];
        var err = rules[k](input.value);
        if (err) ok = false;
        var wrap = input.closest(".field");
        if (show && input.dataset.touched) {
          wrap.classList.toggle("invalid", !!err);
          wrap.querySelector(".err").textContent = err;
        }
      });
      send.classList.toggle("ready", ok);
      return ok;
    };
    form.addEventListener("input", function (e) { check(true); });
    form.addEventListener("focusout", function (e) { if (e.target.name && rules[e.target.name]) { e.target.dataset.touched = "1"; check(true); } });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      Object.keys(rules).forEach(function (k) { form.elements[k].dataset.touched = "1"; });
      if (!check(true)) { var bad = form.querySelector(".field.invalid input, .field.invalid textarea"); if (bad) bad.focus(); return; }
      var data = { name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), email: form.elements.email.value.trim(), message: form.elements.message.value.trim(), company: form.elements.company.value };
      send.disabled = true; send.classList.add("busy");
      send.querySelector(".send-label").textContent = "Sending…";
      msg.hidden = true;
      var done = function () {
        var box = doc.createElement("div");
        box.className = "hi-sent";
        box.setAttribute("role", "status");
        box.innerHTML = window.SITE_PREVIEW
          ? "<h3>Thanks, " + escapeHtml(data.name.split(" ")[0]) + "!</h3><p>This is the preview, so nothing was sent. On the live site this message goes to Senthil's inbox and you get a reply saying “Thanks, will catch up soon.”</p>"
          : "<h3>Thanks, " + escapeHtml(data.name.split(" ")[0]) + "!</h3><p>Your message is on its way. I've also sent a note to " + escapeHtml(data.email) + ". Will catch up soon.</p>";
        form.replaceWith(box);
      };
      var fail = function (text) {
        send.disabled = false; send.classList.remove("busy");
        send.querySelector(".send-label").textContent = "Send Message";
        msg.hidden = false; msg.className = "form-msg bad";
        msg.textContent = text || "The message didn't go through. Please try again, or email senthildevaraj1998@gmail.com.";
      };
      if (window.SITE_PREVIEW) { setTimeout(done, 700); return; }
      fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (r.ok && j.ok) done(); else fail(j.error); }); })
        .catch(function () { fail(); });
    });
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- about: rotating titles ---------- */
  doc.querySelectorAll(".rotator").forEach(function (r) {
    var ul = r.querySelector("ul"), n = ul.children.length, i = 0;
    if (n < 2 || reduce) return;
    ul.appendChild(ul.children[0].cloneNode(true));
    setInterval(function () {
      i++;
      ul.style.transition = "";
      ul.style.transform = "translateY(" + (-i * ul.children[0].offsetHeight) + "px)";
      if (i === n) setTimeout(function () { ul.style.transition = "none"; ul.style.transform = "translateY(0)"; i = 0; }, 750);
    }, 2400);
  });

  /* ---------- draggable galleries ---------- */
  doc.querySelectorAll("[data-gallery]").forEach(function (g) {
    var down = false, sx = 0, sl = 0, moved = false;
    g.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = g.scrollLeft; g.classList.add("dragging"); });
    window.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; g.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", function () { down = false; g.classList.remove("dragging"); });
    var id = g.getAttribute("data-gallery");
    doc.querySelectorAll("[data-gallery-prev='" + id + "'],[data-gallery-next='" + id + "']").forEach(function (b) {
      b.addEventListener("click", function () {
        var dir = b.hasAttribute("data-gallery-next") ? 1 : -1;
        var fig = g.querySelector("figure");
        g.scrollBy({ left: dir * (fig ? fig.offsetWidth + 24 : 300), behavior: reduce ? "auto" : "smooth" });
      });
    });
  });

  /* ---------- reveal on scroll (only for content below the first screen) ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    var items = [].slice.call(doc.querySelectorAll("[data-reveal]"));
    var fold = window.innerHeight * 0.9;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("revealed"); en.target.classList.remove("will-reveal"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top > fold) { el.classList.add("will-reveal"); io.observe(el); }
    });
  }

  /* ---------- footer year ---------- */
  doc.querySelectorAll("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
