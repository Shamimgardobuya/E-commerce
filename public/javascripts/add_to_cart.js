document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.quantity-wrapper').forEach(wrapper => {
      const input = wrapper.querySelector('input[name="quantity"]');
      const btnIncrease = wrapper.querySelector('.btn-increase');
      const btnDecrease = wrapper.querySelector('.btn-decrease');
      const min = parseInt(input.dataset.min) || 1;
      const max = parseInt(input.dataset.max) || 50;
  
      btnIncrease.addEventListener('click', () => {
        let value = parseInt(input.value) || min;
        if (value < max) input.value = value + 1;
      });
  
      btnDecrease.addEventListener('click', () => {
        let value = parseInt(input.value) || min;
        if (value > min) input.value = value - 1;
      });
    });
  });
  