async function generateCode() {
    const topic = document.getElementById("codeTopic").value.trim();
    const complexity = document.getElementById("complexity").value;
  
    if (!topic) {
      alert("Please enter a topic");
      return;
    }
  
    const output = document.getElementById("codeOutput");
    output.innerText = "Generating code...";
  
    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, complexity })
      });
  
      if (!response.ok) throw new Error("Failed to generate code");
  
      const data = await response.json();
      output.innerText = data.code;
    } catch (error) {
      output.innerText = "Error generating code. Please try again.";
      console.error(error);
    }
  }
  document.getElementById("generateCode").addEventListener("click", () => {
    const prompt = document.getElementById("codePrompt").value;
    const output = document.getElementById("codeOutput");

    output.textContent = "Generating code...";

    fetch("/api/code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        output.textContent = data.code;
    })
    .catch(error => {
        output.textContent = "Error generating code";
        console.error(error);
    });
});
