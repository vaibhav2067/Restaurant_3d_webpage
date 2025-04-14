// menu.js

const dishes = [
    {
      name: "Spaghetti Bolognese",
      description: "Rich meat sauce with herbs and garlic.",
      price: "$13.50",
      image: "spaghetti.jpg"
    },
    {
      name: "Sushi Deluxe",
      description: "Assorted nigiri and maki rolls with fresh seafood.",
      price: "$18.00",
    //   video: "sushi.mp4"
      image: "spaghetti.jpg"
    },
    {
      name: "Margherita Pizza",
      description: "Classic Italian pizza with tomatoes, mozzarella and basil.",
      price: "$12.00",
      image: "pizza.jpg"
    },
    {
      name: "Spaghetti Bolognese",
      description: "Rich meat sauce with herbs and garlic.",
      price: "$13.50",
      image: "spaghetti.jpg"
    },
    {
      name: "Sushi Deluxe",
      description: "Assorted nigiri and maki rolls with fresh seafood.",
      price: "$18.00",
      video: "sushi.mp4"
    },
    {
      name: "Margherita Pizza",
      description: "Classic Italian pizza with tomatoes, mozzarella and basil.",
      price: "$12.00",
      image: "pizza.jpg"
    },
    {
      name: "Spaghetti Bolognese",
      description: "Rich meat sauce with herbs and garlic.",
      price: "$13.50",
      image: "spaghetti.jpg"
    },
    {
      name: "Sushi Deluxe",
      description: "Assorted nigiri and maki rolls with fresh seafood.",
      price: "$18.00",
      video: "sushi.mp4"
    },
    {
      name: "Margherita Pizza",
      description: "Classic Italian pizza with tomatoes, mozzarella and basil.",
      price: "$12.00",
      image: "pizza.jpg"
    },
    {
      name: "Spaghetti Bolognese",
      description: "Rich meat sauce with herbs and garlic.",
      price: "$13.50",
      image: "spaghetti.jpg"
    },
    {
      name: "Sushi Deluxe",
      description: "Assorted nigiri and maki rolls with fresh seafood.",
      price: "$18.00",
      video: "sushi.mp4"
    },
    {
      name: "Margherita Pizza",
      description: "Classic Italian pizza with tomatoes, mozzarella and basil.",
      price: "$12.00",
      image: "pizza.jpg"
    },
    {
      name: "Spaghetti Bolognese",
      description: "Rich meat sauce with herbs and garlic.",
      price: "$13.50",
      image: "spaghetti.jpg"
    },
    {
      name: "Sushi Deluxe",
      description: "Assorted nigiri and maki rolls with fresh seafood.",
      price: "$18.00",
      video: "sushi.mp4"
    },
    {
      name: "Margherita Pizza",
      description: "Classic Italian pizza with tomatoes, mozzarella and basil.",
      price: "$12.00",
      image: "pizza.jpg"
    }

  ];
  
  let currentIndex = 0;
  
  const dishList = document.getElementById('dish-list');
  const cardDisplay = document.getElementById('card-display');
  const dishInfo = document.getElementById('dish-info');
  
  function renderDishList() {
    dishList.innerHTML = '';
    dishes.forEach((dish, index) => {
      const item = document.createElement('div');
      item.textContent = dish.name;
      item.className = 'dish-item';
      if (index === currentIndex) item.style.fontWeight = 'bold';
      item.addEventListener('click', () => {
        currentIndex = index;
        updateDisplay();
      });
      dishList.appendChild(item);
    });
  }
  
  function updateDisplay() {
    const dish = dishes[currentIndex];
  
    // Update card
    cardDisplay.innerHTML = '';
    if (dish.video) {
      const video = document.createElement('video');
      video.src = dish.video;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.style.maxWidth = '100%';
      video.style.maxHeight = '100%';
      cardDisplay.appendChild(video);
    } else if (dish.image) {
      const img = document.createElement('img');
      img.src = dish.image;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      cardDisplay.appendChild(img);
    }
  
    // Update info
    dishInfo.innerHTML = `
      <h3>${dish.name}</h3>
      <p>${dish.description}</p>
      <p style="font-size : 32px"><strong>${dish.price}</strong></p>
      <button onclick="addToPlate('${dish.name}')">Add to Plate</button>
    `;
  
    renderDishList();
  }
  
  function addToPlate(dishName) {
    alert(`${dishName} added to your plate!`);
  }
  
  // Initial render
  updateDisplay();
  