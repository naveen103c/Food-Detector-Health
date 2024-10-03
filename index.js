"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Your OpenAI API key
const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual OpenAI API key
const foodRecognitionApiKey = 'YOUR_FOOD_RECOGNITION_API_KEY'; // API key for the food recognition API (Clarifai, Google Vision, etc.)
// Function to call ChatGPT API for analyzing food healthiness
function checkFoodHealth(foodName) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `Is the food "${foodName}" healthy? Provide some health details about it.`;
        try {
            const response = yield fetch('https://api.openai.com/v1/chat/completions', {
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
            const data = yield response.json();
            return data.choices[0].message.content;
        }
        catch (error) {
            console.error('Error:', error);
            return 'Sorry, there was an error fetching the response.';
        }
    });
}
// Function to handle image form submission
function handleTextFormSubmit(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const foodName = document.getElementById('foodName');
        if (foodName.value == "") {
            alert('Please enter food name');
        }
        else {
            // Ask ChatGPT if the food is healthy
            const responseContainer = document.getElementById('response-container');
            const responseParagraph = document.getElementById('response');
            const isHealthyResponse = yield checkFoodHealth(foodName.value);
            responseContainer.style.display = 'block';
            responseParagraph.innerText = isHealthyResponse;
        }
    });
}
// Attach event listeners to both forms
const textForm = document.getElementById('textForm');
if (textForm) {
    textForm.addEventListener('submit', handleTextFormSubmit);
}
// Function to handle food image upload and recognition
function recognizeFood(imageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append('image', imageFile);
        try {
            const response = yield fetch(`https://api.your-food-recognition-service.com/recognize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${foodRecognitionApiKey}`,
                },
                body: formData,
            });
            const data = yield response.json();
            const foodName = data.foodName; // Assuming the response contains the food name
            console.log(`Recognized Food: ${foodName}`);
            return foodName;
        }
        catch (error) {
            console.error('Error recognizing food:', error);
            return null;
        }
    });
}
// Function to handle image form submission
function handleImageFormSubmit(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const imageInput = document.getElementById('imageInput');
        const imageFile = imageInput.files ? imageInput.files[0] : null;
        if (imageFile) {
            // Recognize food from the image
            const foodName = yield recognizeFood(imageFile);
            if (foodName) {
                // Ask ChatGPT if the food is healthy
                const responseContainer = document.getElementById('response-container');
                const responseParagraph = document.getElementById('response');
                const isHealthyResponse = yield checkFoodHealth(foodName);
                responseContainer.style.display = 'block';
                responseParagraph.innerText = isHealthyResponse;
            }
            else {
                alert('Could not recognize the food in the image.');
            }
        }
    });
}
// Attach event listeners to both forms
const imageForm = document.getElementById('imageForm');
if (imageForm) {
    imageForm.addEventListener('submit', handleImageFormSubmit);
}
