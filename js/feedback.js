import { firebaseConfig } from "./firebase-config.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2";
const panel = document.getElementById("accountPanel");
const list = document.getElementById("commentsList");
const statusEl = document.getElementById("commentsStatus");

const configured = !Object.values(firebaseConfig).some(v => String(v).startsWith("YOUR_"));

// ---------- helpers ----------
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;   // textContent keeps user text safe
  return node;
}

function renderComments(items) {
  list.innerHTML = "";
  if (items.length === 0) {
    statusEl.textContent = "No comments yet. Be the first to share your experience!";
    return;
  }
  statusEl.textContent = `${items.length} comment${items.length === 1 ? "" : "s"}`;
  items.forEach(c => {
    const card = el("article", "comment");
    const head = el("div", "comment-head");
    head.appendChild(el("span", "avatar", (c.name || "?").charAt(0).toUpperCase()));
    const who = el("div", "who");
    who.appendChild(el("strong", "", c.name || "Anonymous"));
    const meta = [];
    if (c.shop) meta.push("on " + c.shop);
    if (c.date) meta.push(c.date);
    who.appendChild(el("small", "", meta.join(" · ")));
    head.appendChild(who);
    if (c.rating) head.appendChild(el("span", "stars", "★".repeat(c.rating) + "☆".repeat(5 - c.rating)));
    card.appendChild(head);
    card.appendChild(el("p", "comment-text", c.text));
    if (c.canDelete) {
      const del = el("button", "link-btn", "Delete my comment");
      del.addEventListener("click", c.onDelete);
      card.appendChild(del);
    }
    list.appendChild(card);
  });
}

// ---------- not configured yet ----------
if (!configured) {
  statusEl.textContent = "Comments will appear here once the site is connected to Firebase.";
  panel.innerHTML = `
    <h3>Login &amp; comment</h3>
    <p class="note-box">ℹ️ Login is not switched on yet. Follow the Firebase setup steps, then paste your settings into <code>js/firebase-config.js</code>.</p>`;
} else {
  start();
}

async function start() {
  try {
    const { initializeApp } = await import(`${FB}/firebase-app.js`);
    const {
      getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
      updateProfile, signInWithPopup, GoogleAuthProvider, signOut, sendPasswordResetEmail
    } = await import(`${FB}/firebase-auth.js`);
    const {
      getFirestore, collection, addDoc, deleteDoc, doc, query, orderBy, limit, onSnapshot, serverTimestamp
    } = await import(`${FB}/firebase-firestore.js`);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    let user = null;

    // ----- live comments -----
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"), limit(50));
    let lastSnap = null;
    function draw() {
      if (!lastSnap) return;
      const items = lastSnap.docs.map(d => {
        const data = d.data();
        const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "";
        const mine = user && data.uid === user.uid;
        return {
          name: data.name, text: data.text, rating: data.rating, shop: data.shop, date,
          canDelete: mine,
          onDelete: async () => { if (confirm("Delete this comment?")) await deleteDoc(doc(db, "comments", d.id)); }
        };
      });
      renderComments(items);
    }
    onSnapshot(q, snap => { lastSnap = snap; draw(); },
      () => { statusEl.textContent = "Could not load comments. Check your Firestore rules."; });

    // ----- account panel -----
    function showLoggedOut(mode = "login", message = "") {
      panel.innerHTML = `
        <h3>${mode === "login" ? "Log in to comment" : "Create an account"}</h3>
        <p class="panel-sub">Anyone can read comments. You need an account to post one.</p>
        <button class="btn btn-google" id="googleBtn" type="button">Continue with Google</button>
        <div class="or"><span>or</span></div>
        <form id="authForm" class="auth-form">
          ${mode === "signup" ? '<input type="text" id="authName" placeholder="Your name" maxlength="60" required>' : ""}
          <input type="email" id="authEmail" placeholder="Email" required>
          <input type="password" id="authPass" placeholder="Password (6+ characters)" minlength="6" required>
          <button class="btn btn-call" type="submit">${mode === "login" ? "Log in" : "Sign up"}</button>
        </form>
        <p class="form-status" id="authMsg">${message}</p>
        <p class="panel-links">
          <button class="link-btn" id="switchMode" type="button">${mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}</button>
          ${mode === "login" ? '<button class="link-btn" id="resetPass" type="button">Forgot password?</button>' : ""}
        </p>`;

      const msg = panel.querySelector("#authMsg");
      panel.querySelector("#switchMode").onclick = () => showLoggedOut(mode === "login" ? "signup" : "login");
      panel.querySelector("#googleBtn").onclick = async () => {
        try { await signInWithPopup(auth, new GoogleAuthProvider()); }
        catch (e) { msg.textContent = friendly(e); }
      };
      const reset = panel.querySelector("#resetPass");
      if (reset) reset.onclick = async () => {
        const email = panel.querySelector("#authEmail").value.trim();
        if (!email) { msg.textContent = "Type your email above first."; return; }
        try { await sendPasswordResetEmail(auth, email); msg.textContent = "Password reset email sent."; }
        catch (e) { msg.textContent = friendly(e); }
      };
      panel.querySelector("#authForm").onsubmit = async (e) => {
        e.preventDefault();
        const email = panel.querySelector("#authEmail").value.trim();
        const pass = panel.querySelector("#authPass").value;
        msg.textContent = "Please wait...";
        try {
          if (mode === "signup") {
            const cred = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(cred.user, { displayName: panel.querySelector("#authName").value.trim() });
            user = auth.currentUser;
            showLoggedIn();
          } else {
            await signInWithEmailAndPassword(auth, email, pass);
          }
        } catch (err) { msg.textContent = friendly(err); }
      };
    }

    function showLoggedIn(message = "") {
      const name = user.displayName || user.email.split("@")[0];
      panel.innerHTML = `
        <div class="who-row">
          <span class="avatar">${name.charAt(0).toUpperCase()}</span>
          <div><strong id="meName"></strong><small>Logged in</small></div>
          <button class="link-btn" id="logoutBtn" type="button">Log out</button>
        </div>
        <form id="commentForm" class="auth-form">
          <h3>Share your experience</h3>
          <select id="cShop">
            <option value="">General comment about Chungu Hub</option>
            ${shops.map(s => `<option value="${s.name}">${s.name}</option>`).join("")}
          </select>
          <select id="cRating" required>
            <option value="">Rating</option>
            <option value="5">★★★★★ Excellent</option>
            <option value="4">★★★★ Good</option>
            <option value="3">★★★ Okay</option>
            <option value="2">★★ Poor</option>
            <option value="1">★ Very poor</option>
          </select>
          <textarea id="cText" rows="4" maxlength="600" placeholder="What do you think?" required></textarea>
          <button class="btn btn-call" type="submit">Post comment</button>
        </form>
        <p class="form-status" id="postMsg">${message}</p>`;
      panel.querySelector("#meName").textContent = name;
      panel.querySelector("#logoutBtn").onclick = () => signOut(auth);
      panel.querySelector("#commentForm").onsubmit = async (e) => {
        e.preventDefault();
        const msg = panel.querySelector("#postMsg");
        msg.textContent = "Posting...";
        try {
          await addDoc(collection(db, "comments"), {
            uid: user.uid,
            name: name.slice(0, 60),
            shop: panel.querySelector("#cShop").value,
            rating: Number(panel.querySelector("#cRating").value),
            text: panel.querySelector("#cText").value.trim().slice(0, 600),
            createdAt: serverTimestamp()
          });
          e.target.reset();
          msg.textContent = "Thank you! Your comment is posted.";
        } catch (err) { msg.textContent = "Could not post: " + friendly(err); }
      };
    }

    function friendly(e) {
      const map = {
        "auth/invalid-credential": "Wrong email or password.",
        "auth/email-already-in-use": "That email already has an account. Try logging in.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-email": "That email address does not look right.",
        "auth/popup-closed-by-user": "Sign-in window was closed.",
        "permission-denied": "You do not have permission. Check your Firestore rules."
      };
      return map[e.code] || e.message;
    }

    onAuthStateChanged(auth, u => {
      user = u;
      if (u) showLoggedIn(); else showLoggedOut();
      draw();
    });
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Could not connect to the comments service. Please try again later.";
    panel.innerHTML = "<h3>Login unavailable</h3><p class='note-box'>Check your internet connection and refresh.</p>";
  }
}