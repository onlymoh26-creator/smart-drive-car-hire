
"use strict";

/* SMART DRIVE CAR HIRE SERVICES
   Website interactions and booking enquiries.
*/

document.addEventListener("DOMContentLoaded", function () {
  const WHATSAPP_NUMBER = "254733920806";

  const bookingForm = document.getElementById("bookingForm");
  const formMessage = document.getElementById("formMessage");
  const categorySelect = document.getElementById("category");
  const fleetGrid = document.getElementById("fleetGrid");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const yearElement = document.getElementById("year");

  // Automatically update the copyright year.
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Set the earliest permitted pickup date to today.
  const pickupInput = document.querySelector('[name="pickup"]');
  const returnInput = document.querySelector('[name="return"]');

  function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (pickupInput) {
    pickupInput.min = getLocalDate();
  }

  function updateReturnDate() {
    if (!pickupInput || !returnInput) return;

    returnInput.min = pickupInput.value || getLocalDate();

    if (
      pickupInput.value &&
      returnInput.value &&
      returnInput.value < pickupInput.value
    ) {
      returnInput.value = "";
    }
  }

  if (pickupInput) {
    pickupInput.addEventListener("change", updateReturnDate);
  }

  updateReturnDate();

  // Filter the existing vehicle categories.
  function normalizeCategory(value) {
    return value
      .toLowerCase()
      .replace(/×/g, "x")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  function filterFleet(category) {
    if (!fleetGrid) return;

    const sections = fleetGrid.querySelectorAll(
      ".fleet-category-section"
    );

    sections.forEach(function (section) {
      const heading = section.querySelector("h2");
      const sectionCategory = heading
        ? normalizeCategory(heading.textContent)
        : "";

      const selected = normalizeCategory(category);

      const matches =
        selected === "all" ||
        sectionCategory === selected ||
        (selected === "suvs & 4x4" &&
          sectionCategory === "suvs & 4x4");

      section.hidden = !matches;
    });

    filterButtons.forEach(function (button) {
      const active =
        normalizeCategory(button.dataset.filter || "") ===
        normalizeCategory(category);

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterFleet(button.dataset.filter || "All");

      if (categorySelect) {
        const filter = button.dataset.filter || "All";
        const options = Array.from(categorySelect.options);

        const matchingOption = options.find(function (option) {
          return (
            normalizeCategory(option.value || option.textContent) ===
            normalizeCategory(filter)
          );
        });

        if (matchingOption) {
          categorySelect.value = matchingOption.value;
        } else if (normalizeCategory(filter) === "all") {
          categorySelect.value = "Any category";
        }
      }
    });
  });

  // Keep filtering consistent when a category is selected in the form.
  if (categorySelect) {
    categorySelect.addEventListener("change", function () {
      const category = categorySelect.value;

      if (normalizeCategory(category) === "any category") {
        filterFleet("All");
      } else {
        filterFleet(category);
      }
    });
  }

  // Connect booking enquiries to WhatsApp.
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!bookingForm.reportValidity()) return;

      const data = new FormData(bookingForm);

      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const service = String(data.get("service") || "").trim();
      const category = String(data.get("category") || "").trim();
      const pickup = String(data.get("pickup") || "");
      const returnDate = String(data.get("return") || "");
      const location = String(data.get("location") || "").trim();
      const email = String(data.get("email") || "").trim();
      const notes = String(data.get("notes") || "").trim();

      if (!name || !phone || !service || !pickup ||
          !returnDate || !location) {
        showMessage("Please complete all required fields.", true);
        return;
      }

      if (pickup < getLocalDate()) {
        showMessage("Please select today or a future pickup date.", true);
        return;
      }

      if (returnDate < pickup) {
        showMessage(
          "The return date cannot be earlier than the pickup date.",
          true
        );
        return;
      }

      // Calculate rental days using calendar dates, not elapsed hours.
      function dateToUtcDay(dateString) {
        const parts = dateString.split("-").map(Number);
        return Date.UTC(parts[0], parts[1] - 1, parts[2]);
      }

      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const rentalDays = Math.max(
        1,
        Math.round(
          (dateToUtcDay(returnDate) - dateToUtcDay(pickup)) /
          millisecondsPerDay
        )
      );

      const message = [
        "SMART DRIVE CAR HIRE SERVICES",
        "VEHICLE BOOKING ENQUIRY",
        "",
        `Customer name: ${name}`,
        `Phone number: ${phone}`,
        `Vehicle category: ${category}`,
        `Service type: ${service}`,
        `Pickup date: ${pickup}`,
        `Return date: ${returnDate}`,
        `Rental duration: ${rentalDays} day(s)`,
        `Pickup location: ${location}`,
        email ? `Email: ${email}` : "",
        notes ? `Trip details: ${notes}` : "",
        "",
        "Please confirm vehicle availability and the final quotation.",
        "I understand that this enquiry is not a confirmed booking."
      ].filter(Boolean).join("\n");

      showMessage(
        "Your enquiry is ready. WhatsApp will open so you can review and send it.",
        false
      );

      const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  function showMessage(message, isError) {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.setAttribute("role", "status");
    formMessage.style.color = isError ? "#ff8b8b" : "#f0d38c";
  }

  console.info("Smart Drive Car Hire JavaScript initialized.");
});
