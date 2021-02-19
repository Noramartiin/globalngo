document.addEventListener(
  'DOMContentLoaded',
  () => {
    let menuLayout = document.querySelector('.menu-layout');
    let menuDisplay = document.querySelectorAll('.menu-display');
    let editInformation = document.querySelector('.edit-profile');
    let formInformation = document.querySelector('.display-form-none');
    let deleteInformation = document.querySelector('.delete-profile');
    let divDelete = document.querySelector('.div-delete');
    let editNgos = document.querySelector('.nav-profile');
    let divNgos = document.querySelector('.div-ngos');

    menuLayout.addEventListener('click', () => {
      menuDisplay.forEach(e => {
        if (e.style.display == 'none') {
          e.style.display = 'block';
        } else {
          e.style.display = 'none';
        }
      });
    });
    editInformation.addEventListener('click', () => {
      if (formInformation.style.display == 'none') {
        formInformation.style.display = 'block';
      } else {
        formInformation.style.display = 'none';
      }
    });
    deleteInformation.addEventListener('click', () => {
      if (divDelete.style.display == 'none') {
        divDelete.style.display = 'block';
      } else {
        divDelete.style.display = 'none';
      }
    });
    editNgos.addEventListener('click', () => {
      if (divNgos.style.display == 'none') {
        divNgos.style.display = 'block';
      } else {
        divNgos.style.display = 'none';
      }
    });
  },
  false
);
