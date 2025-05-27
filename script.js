document.getElementById("addLink").onclick = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter another link";
  input.classList.add("link-input");
  document.getElementById("linkForm").insertBefore(input, document.getElementById("addLink"));
};

document.getElementById("linkForm").onsubmit = async (e) => {
  e.preventDefault();

  const links = Array.from(document.getElementsByClassName("link-input"))
    .map(i => i.value.trim())
    .filter(Boolean);

  if (!links.length) return alert("Please enter at least one link");

  try {
    const docRef = await db.collection("qr_links").add({ links });
    const previewUrl = `https://venerable-lokum-ab44dd.netlify.app/preview.html?id=${docRef.id}`;

    // Generate QR as PNG
    QRCode.toDataURL(previewUrl, { width: 256 }, (err, url) => {
      if (err) return console.error(err);
      document.getElementById("qrPreview").src = url;
      document.getElementById("qrPreview").style.display = "block";
      document.getElementById("downloadBtns").style.display = "block";
      document.getElementById("qrCanvas").style.display = "none";

      // Download PNG
      document.getElementById("downloadPng").onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "qr-code.png";
        a.click();
      };
    });

    // Generate SVG
    QRCode.toString(previewUrl, { type: 'svg' }, (err, svg) => {
      if (err) return console.error(err);

      document.getElementById("downloadSvg").onclick = () => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qr-code.svg";
        a.click();
        URL.revokeObjectURL(url);
      };
    });

  } catch (error) {
    console.error("Error saving links to Firebase:", error);
  }
};
