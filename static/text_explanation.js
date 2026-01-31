async function generateText() {
    const topic = document.getElementById("topic").value.trim();
    const depth = document.getElementById("depth").value;
  
    if (!topic) {
      alert("Please enter a topic");
      return;
    }
  
    const output = document.getElementById("output");
    output.innerText = "Generating explanation...";
  
    try {
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, depth })
      });
  
      if (!response.ok) throw new Error("Failed to generate");
  
      const data = await response.json();
      output.innerText = data.content;
    } catch (error) {
      output.innerText = "Error generating explanation. Please try again.";
      console.error(error);
    }
  }
  document.getElementById("submitText").addEventListener("click", () => {
    const input = document.getElementById("textInput").value;
    const output = document.getElementById("textOutput");

    output.innerText = "Processing...";

    fetch("/api/text", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: input })
    })
    .then(response => response.json())
    .then(data => {
        output.innerText = data.response;
    })
    .catch(error => {
        output.innerText = "Error occurred!";
        console.error(error);
    });
});