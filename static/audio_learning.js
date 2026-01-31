async function generateAudio() {
    const topic = document.getElementById("audioTopic").value.trim();
  
    if (!topic) {
      alert("Please enter a topic");
      return;
    }
  
    const scriptDiv = document.getElementById("audioScript");
    scriptDiv.innerText = "Generating audio lesson...";
  
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
  
      if (!response.ok) throw new Error("Failed to generate audio");
  
      const data = await response.json();
      scriptDiv.innerText = data.script;
  
      if (data.audioUrl) {
        document.getElementById("audioPlayer").src = data.audioUrl;
      }
    } catch (error) {
      scriptDiv.innerText = "Error generating audio. Please try again.";
      console.error(error);
    }
  }
  document.getElementById("generateAudio").addEventListener("click", () => {
    const text = document.getElementById("audioText").value;
    const output = document.getElementById("audioOutput");

    output.innerText = "Generating audio...";

    fetch("/api/audio", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        output.innerHTML = `
            <p>${data.message}</p>
            <p><strong>Text:</strong> ${data.text}</p>
        `;
    })
    .catch(error => {
        output.innerText = "Error generating audio";
        console.error(error);
    });
});
