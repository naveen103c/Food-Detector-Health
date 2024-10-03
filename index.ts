// Your OpenAI API key
const apiKey = 'YOUR_OPENAI_API_KEY';  // Replace with your actual OpenAI API key
const foodRecognitionApiKey = 'YOUR_FOOD_RECOGNITION_API_KEY';  // API key for the food recognition API (Clarifai, Google Vision, etc.)

// Function to call ChatGPT API for analyzing food healthiness
async function checkFoodHealth(foodName: string) {
    const prompt = `Is the food "${foodName}" healthy? Provide some health details about it.`;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error fetching the response.';
    }
}

// Function to handle image form submission
async function handleTextFormSubmit(event: Event) {
    event.preventDefault();
    const foodName = document.getElementById('foodName') as HTMLInputElement;
    if(foodName.value==""){
        alert('Please enter food name');
    }else{
        // Ask ChatGPT if the food is healthy
        const responseContainer = document.getElementById('response-container') as HTMLElement;
        const responseParagraph = document.getElementById('response') as HTMLElement;
        const isHealthyResponse = await checkFoodHealth(foodName.value);
        responseContainer.style.display = 'block';
        responseParagraph.innerText = isHealthyResponse;
    }
}

// Attach event listeners to both forms
const textForm = document.getElementById('textForm') as HTMLFormElement;
if (textForm) {
    textForm.addEventListener('submit', handleTextFormSubmit);
}


// Function to handle food image upload and recognition
async function recognizeFood(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
        const response = await fetch(`https://api.your-food-recognition-service.com/recognize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${foodRecognitionApiKey}`,
            },
            body: formData,
        });
        const data = await response.json();
        const foodName = data.foodName;  // Assuming the response contains the food name
        console.log(`Recognized Food: ${foodName}`);
        return foodName;
    } catch (error) {
        console.error('Error recognizing food:', error);
        return null;
    }
}

// Function to handle image form submission
async function handleImageFormSubmit(event: Event) {
    event.preventDefault();
    const imageInput = document.getElementById('imageInput') as HTMLInputElement;
    const imageFile = imageInput.files ? imageInput.files[0] : null;
    if (imageFile) {
        // Recognize food from the image
        const foodName = await recognizeFood(imageFile);
        if (foodName) {
            // Ask ChatGPT if the food is healthy
            const responseContainer = document.getElementById('response-container') as HTMLElement;
            const responseParagraph = document.getElementById('response') as HTMLElement;
            const isHealthyResponse = await checkFoodHealth(foodName);
            responseContainer.style.display = 'block';
            responseParagraph.innerText = isHealthyResponse;
        } else {
            alert('Could not recognize the food in the image.');
        }
    }
}

// Attach event listeners to both forms
const imageForm = document.getElementById('imageForm') as HTMLFormElement;
if (imageForm) {
    imageForm.addEventListener('submit', handleImageFormSubmit);
}
