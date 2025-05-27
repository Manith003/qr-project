const id = new URLSearchParams(window.location.search).get("id");

if (id) {
  db.collection("qr_links").doc(id).get().then(doc => {
    if (doc.exists) {
      const links = doc.data().links;
      const ul = document.getElementById("linkList");
      links.forEach(link => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
        ul.appendChild(li);
      });
    } else {
      document.body.innerHTML = "<p>Invalid or expired QR code.</p>";
    }
  });
} else {
  document.body.innerHTML = "<p>No QR ID provided.</p>";
}
