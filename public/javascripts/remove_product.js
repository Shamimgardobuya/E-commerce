document.addEventListener('DOMContentLoaded', function () {
    const removeButtons = document.querySelectorAll("[id^='removeBtn-']");
    const csrfToken = document.querySelector('input[name="_csrf"]').value; // Get the CSRF token

    removeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const batchNo = button.id.split('removeBtn-')[1];
            const divContent = document.getElementById(`removeProduct-${batchNo}`);

            const inputs = divContent.querySelectorAll('input');
            const formData = new FormData();

            inputs.forEach(input => {
                if (input.name) {
                    console.log(input.value)
                    
                    formData.append(input.name, input.value);
                }
            });
            const request = new XMLHttpRequest();
            request.open("POST", "/orders/remove/from/cart");
            request.withCredentials = true;
            request.setRequestHeader('X-CSRF-Token', csrfToken);

            request.onload = function () {
                if (request.status >= 200) {
                    console.log("Item removed:", request.responseText);
                    location.reload();
                } else {
                    console.error("Remove failed:", request.status);
                }
            };


            request.onerror = function () {
                console.error("Network error.");
            };

            request.send(formData);
        });
    });
});
