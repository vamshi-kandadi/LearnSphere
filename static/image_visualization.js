async function generateImages() {
    const topic = document.getElementById("imageTopic").value.trim();
  
    if (!topic) {
      alert("Please enter a topic");
      return;
    }
  
    const output = document.getElementById("imageOutput");
    output.innerText = "Generating diagrams...";
  
    try {
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
  
      if (!response.ok) throw new Error("Failed to generate images");
  
      const data = await response.json();
      output.innerText = data.visualization;
    } catch (error) {
      output.innerText = "Error generating diagrams. Please try again.";
      console.error(error);
    }
  }
  document.getElementById("generateImage").addEventListener("click", () => {
    const prompt = document.getElementById("imagePrompt").value;
    const output = document.getElementById("imageOutput");

    output.innerText = "Generating image...";

    fetch("/api/image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        output.innerHTML = `
            <p>${data.message}</p>
            <p><strong>Prompt:</strong> ${data.prompt}</p>
        `;
    })
    .catch(error => {
        output.innerText = "Error generating image";
        console.error(error);
    });
});

  