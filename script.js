// Sample data
const restaurants = [
  {
    name: "Pizza  Hut",
    address: "Dilsukhnagar, Hyberabad",
    cuisine: "Italian",
    rating: 4.5,
    menu: [
      { name: "Margherita Pizza", price: 199 },
      { name: "Pepperoni Pizza", price: 199 },
    ],
  },
  {
    name: "Burger King",
    address: "L.B Nagar, Hyderabad",
    cuisine: "American",
    rating: 4.2,
    menu: [
      { name: "Cheeseburger", price: 199 },
      { name: "Veggie Burger", price: 179 },
    ],
  },
  {
    name: "Bawarchi Restaurant",
    address: "Dilsukhnagar, Hyberabad",
    cuisine: "Indian",
    rating: 4.8,
    menu: [
      { name: "Veg Biryani", price: 100 },
      { name: "Chicken Biryani", price: 150 },
      { name: "Chicken Fired Piece Biryani", price: 180 },
      { name: "Mutton Biryani", price: 200 },
    ],
  },
  {
    name: "Village Kitchen",
    address: "Uppal, Hyderabad",
    cuisine: "Indian Andhra",
    rating: 4.2,
    menu: [
      { name: "Veg Manchuria / Veg 65", price: 149 },
      { name: "Gobi Manchuria / Gobi 65", price: 149 },
      { name: "Paneer Manchuria", price: 169 },
      { name: "Veg Biryani", price: 159 },
      { name: "Egg Biryani", price: 159 },
      { name: "chicken fry", price: 179 },
      { name: "Chicken fry (boneless)", price: 199 },
      { name: "chicken Manchuria/65/chilli", price: 199 },
      { name: "Chicken Biryani", price: 239 },
      { name: "Chicken Fried Piece Biryani", price: 250 },
      { name: "Mutton Biryani", price: 239 },
      { name: "Prawns/Fish Biryani", price: 250 },
    ],
  },
];

let currentOrder = {};

function initIndexPage() {
  const restaurantSelect = document.getElementById("restaurant");
  const menuItemSelect = document.getElementById("menu-item");
  const restaurantsDiv = document.getElementById("restaurants");
  const searchInput = document.getElementById("search");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-body");
  const closeButton = document.querySelector(".close-button");
  const orderSummary = document.getElementById("order-summary");

  // Populate restaurant list
  const displayRestaurants = (filter = "") => {
    restaurantsDiv.innerHTML = "";
    restaurants
      .filter((restaurant) =>
        restaurant.name.toLowerCase().includes(filter.toLowerCase())
      )
      .forEach((restaurant, index) => {
        const restaurantElement = document.createElement("div");
        restaurantElement.innerHTML = `<h3>${restaurant.name}</h3>`;
        const menuList = document.createElement("ul");
        
        restaurant.menu.forEach((menuItem) => {
          const menuItemElement = document.createElement("li");
          menuItemElement.textContent = `${menuItem.name} - $${menuItem.price.toFixed(2)}`;
          menuList.appendChild(menuItemElement);
        });
        
        restaurantElement.appendChild(menuList);
        restaurantsDiv.appendChild(restaurantElement);

        // Add click event to open modal
        restaurantElement.addEventListener("click", () => {
          modalContent.innerHTML = `
            <h3>${restaurant.name}</h3>
            <p><strong>Address:</strong> ${restaurant.address}</p>
            <p><strong>Cuisine:</strong> ${restaurant.cuisine}</p>
            <p><strong>Rating:</strong> ${restaurant.rating}</p>
          `;
          modal.style.display = "block";
        });

        // Populate restaurant select options
        const option = document.createElement("option");
        option.value = index;
        option.textContent = restaurant.name;
        restaurantSelect.appendChild(option);
      });
  };

  displayRestaurants();

  // Update menu items when restaurant changes
  restaurantSelect.addEventListener("change", () => {
    const selectedRestaurantIndex = restaurantSelect.value;
    menuItemSelect.innerHTML = "";

    if (selectedRestaurantIndex !== "") {
      const selectedRestaurant = restaurants[selectedRestaurantIndex];

      selectedRestaurant.menu.forEach((menuItem) => {
        const option = document.createElement("option");
        option.value = menuItem.name;
        option.textContent = `${menuItem.name} - $${menuItem.price.toFixed(2)}`;
        menuItemSelect.appendChild(option);
      });
    }
  });

  // Handle form submission
  document.getElementById("order-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedRestaurantIndex = restaurantSelect.value;
    const selectedMenuItem = menuItemSelect.value;
    const quantity = document.getElementById("quantity").value;

    if (selectedRestaurantIndex !== "" && selectedMenuItem !== "" && quantity > 0) {
      const selectedRestaurant = restaurants[selectedRestaurantIndex];
      const orderItem = selectedRestaurant.menu.find(item => item.name === selectedMenuItem);

      currentOrder = {
        restaurant: selectedRestaurant.name,
        menuItem: orderItem.name,
        quantity,
        price: orderItem.price * quantity,
      };

      orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        <p>Restaurant: ${selectedRestaurant.name}</p>
        <p>Menu Item: ${orderItem.name}</p>
        <p>Quantity: ${quantity}</p>
        <p>Total Price: $${(orderItem.price * quantity).toFixed(2)}</p>
      `;
    }
  });

  // Modal close button
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    displayRestaurants(e.target.value);
  });
}

function initOrderPage() {
  document.getElementById("delivery-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;

    currentOrder.address = {
      address,
      city,
      state,
      zip,
    };

    localStorage.setItem("currentOrder", JSON.stringify(currentOrder));

    window.location.href = "payment.html";
  });
}

function initPaymentPage() {
  document.getElementById("payment-form").addEventListener("submit", (event) => {
    event.preventDefault();

    alert("Payment successful! Your order has been placed.");

    // Clear the current order
    localStorage.removeItem("currentOrder");

    // Redirect to the home page
    window.location.href = "index.html";
  });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("restaurant")) {
    initIndexPage();
  } else if (document.getElementById("delivery-form")) {
    initOrderPage();
  } else if (document.getElementById("payment-form")) {
    initPaymentPage();
  }
});