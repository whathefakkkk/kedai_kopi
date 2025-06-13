// toggle class active hamburger menu
const navbarNav = document.querySelector('.navbar-nav');
// ketika hamburger menu di klik
document.querySelector('#hamburger-menu').onclick = (e) => {
  navbarNav.classList.toggle('active');
  e.preventDefault();
};

// toggle class active shopping-cart form
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// klik di luar element
const hm = document.querySelector('#hamburger-menu');
const sc = document.querySelector('#shopping-cart');

document.addEventListener('click', function(e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  };

  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  };
});

// shopping-cart function
const cartItems = {};
const cartArea = document.querySelector('.cart-scroll-area');
const cartCount = document.querySelector('.cart-count');
const orderBtn = document.querySelector('.order-btn');

document.querySelectorAll('.icon-cart').forEach((btn) => {
  btn.addEventListener('click', function () {
    const card = this.closest('.menu-card');
    const name = card.querySelector('.menu-card-title').innerText.trim();
    const price = parseInt(card.querySelector('.menu-card-price').dataset.price);
    const img = card.querySelector('.menu-img').dataset.image;

    if (cartItems[name]) {
      cartItems[name].qty += 1;
    } else {
      cartItems[name] = { price, qty: 1, image: img};
    }

    updateCartIcon();
    renderCart();

    // notif menu ditambahkan
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `"${name}" ditambahkan ke keranjang!`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        popup: 'swal2-toast-custom'
      },
      showClass: {
        popup: 'swal2-animate-slide-in'
      },
      hideClass: {
        popup: 'swal2-animate-slide-out'
      }
    });
  });
});

function updateCartIcon() {
  const totalQty = Object.values(cartItems).reduce((sum, item) => sum + item.qty, 0);
  cartCount.innerText = totalQty;
  cartCount.style.display = totalQty > 0 ? 'inline-block' : 'none';
}

function renderCart() { //render menu item
  cartArea.innerHTML = ""; // kosongkan dulu
  let totalQty = 0;

  for (const name in cartItems) {
    const item = cartItems[name];
    totalQty += item.qty;

    const itemHTML = `
      <div class="cart-items">
        <img src="${item.image}" alt="${name}">
        <div class="item-detail">
          <h3>${name}</h3>
          <div class="item-price" data-price="${item.price}">IDR ${item.price.toLocaleString()}</div>
          <input type="number" min="1" value="${item.qty}" class="qty-input">
          <div class="item-total">Total: IDR ${(item.qty * item.price).toLocaleString()}</div>
        </div>
        <img src="./assets/icons/Hitam/trash-2.svg" class="trash-icons remove-item" alt="remove">
      </div>
    `;

    cartArea.insertAdjacentHTML("beforeend", itemHTML);

  }
  // Enable ORDER if ada item
  orderBtn.disabled = totalQty === 0;
  orderBtn.style.opacity = totalQty === 0 ? 0.5 : 1;
  orderBtn.style.cursor = totalQty === 0 ? "not-allowed" : "pointer";

  bindQtyEvents();

  cartArea.querySelectorAll('.remove-item').forEach((btn) => {
      btn.addEventListener('click', function() {
        shoppingCart.classList.remove('active');
        const itemName = this.closest('.cart-items').querySelector('h3').innerText.trim();
        
        Swal.fire({
          title: `Hapus "${itemName}" dari keranjang?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#aaa',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'   
        }).then((result) => {
          if (result.isConfirmed) {
            delete cartItems[itemName];
            updateCartIcon();
            renderCart();

            Swal.fire({
              title: 'Dihapus!',
              text: `"${itemName}" berhasil dihapus.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      });
    });
}

function bindQtyEvents() {
  const qtyInputs = cartArea.querySelectorAll('.qty-input');

  qtyInputs.forEach((input) => {
    input.addEventListener('input', function() {
      const parent = this.closest('.cart-items');
      const itemName = parent.querySelector('h3').innerText.trim();
      const newQty = parseInt(this.value);

      if (newQty <= 0 || isNaN(newQty)) return;

      cartItems[itemName].qty = newQty;

      updateCartIcon();
      renderCart();     
    });
  }); 
}

function bindCartEventsToModal() {
  const modalCards = document.querySelectorAll('#modal-all-menu .menu-card .icon-cart');

  modalCards.forEach((btn) => {
    btn.addEventListener('click', function () {
      const card = this.closest('.menu-card');
      const name = card.querySelector('.menu-card-title').innerText.trim();
      const price = parseInt(card.querySelector('.menu-card-price').dataset.price);
      const img = card.querySelector('.menu-img').dataset.image;

      if (cartItems[name]) {
        cartItems[name].qty += 1;
      } else {
        cartItems[name] = {
          price: price,
          qty: 1,
          image: img
        };
      }

      updateCartIcon();
      renderCart();
      // Toast notifikasi berhasil
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `"${name}" ditambahkan ke keranjang!`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: 'swal2-toast-custom'
        },
        showClass: {
          popup: 'swal2-animate-slide-in'
        },
        hideClass: {
          popup: 'swal2-animate-slide-out'
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Update Total Otomatis (Qty × Harga)
  const qtyInputs = document.querySelectorAll('.qty-input');
  const orderBtn = document.querySelector('.shopping-cart .order-btn');

  function updateTotals() {
    let totalOrder = 0;
    qtyInputs.forEach((input) => {
      const parent = input.closest('.item-detail');
      const priceElement = parent.querySelector('.item-price');
      const totalElement = parent.querySelector('.item-total');
      const price = parseInt(priceElement.dataset.price);
      const qty = parseInt(input.value);

      const subtotal = price * qty;
      totalElement.textContent = `Total: IDR ${subtotal.toLocaleString()}`;

      totalOrder += qty;
    });

    if (totalOrder === 0) {
      orderBtn.disabled = true;
      orderBtn.style.opacity = 0.5;
      orderBtn.style.cursor = 'not-allowed';
    } else {
      orderBtn.disabled = false;
      orderBtn.style.opacity = 1;
      orderBtn.style.cursor = 'pointer';
    }
  }

  qtyInputs.forEach((input) => {
    input.addEventListener('input', updateTotals);
  });

  updateTotals(); // initial run
  // Script Modal "More Menu"
  const allCards = document.querySelectorAll('.menu-card');
  const modalGrid = document.querySelector('#modal-all-menu .modal-menu-grid');
  const moreBtn = document.querySelector('.more-menu-btn');
  const maxVisible = getMaxVisibleItems();

    moreBtn.style.display = 'inline-block';

    allCards.forEach((card, index) => {
      if (index >= maxVisible) {
        const clone = card.cloneNode(true);
        modalGrid.appendChild(clone);
        card.style.display = 'none';
      } else {
        card.style.display = 'block';
      }
    });

    bindCartEventsToModal();

    modalGrid.querySelectorAll('.icon-eye').forEach((icon) => {
      icon.addEventListener('click', function () {
        const target = this.dataset.target;
        const modal = document.querySelector(target);
        if (modal) modal.style.display = 'block';
      });
    });

  moreBtn.addEventListener('click', () => {
    document.querySelector('#modal-all-menu').style.display = 'block';
  });

  document.querySelectorAll('.close-icon').forEach((btn) => {
    btn.addEventListener('click', function () {
      const modal = this.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });

  window.addEventListener('click', function (e) {
    const modal = document.querySelector('#modal-all-menu');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

document.querySelectorAll('.icon-eye').forEach((eyeIcon) => {
  eyeIcon.addEventListener('click', function () {
    const target = this.dataset.target;
    const modal = document.querySelector(target);
    if (modal) modal.style.display = 'block';
  });
});

document.querySelectorAll('.close-icon').forEach((btn) => {
  btn.addEventListener('click', function () {
    const modal = this.closest('.modal');
    if (modal) modal.style.display = 'none';
  });
});

window.addEventListener('click', function (e) {
  document.querySelectorAll('.modal').forEach((modal) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// item menu
function getMaxVisibleItems() {
  const width = window.innerWidth;
  if (width >= 1024) return 10;  // desktop
  if (width >= 768) return 6;    // tablet
  return 4;                      // mobile
}

// tombol order
orderBtn.addEventListener('click', function () {
  shoppingCart.classList.remove('active');
  if (Object.keys(cartItems).length === 0) return;

  Swal.fire({
    title: 'Data Pemesan',
    html:
      `<input id="swal-input-name" class="swal2-input" placeholder="Nama Pelanggan" autocomplete="off">` + 
      `<input id="swal-input-nohp" class="swal2-input" placeholder="No Hp Pelanggan" autocomplete="off">` +
      `<textarea id="swal-input-address" class="swal2-textarea" placeholder="Alamat Pengiriman"></textarea>` +
      `<select id="swal-payment-method" class="swal2-select" style="margin-top:10px;">
      <option value="">Pilih Metode Pembayaran</option>
      <option value="COD">COD</option>
      <option value="Transfer BRI">Transfer BRI</option>
      <option value="Transfer BCA">Transfer BCA</option>
      <option value="DANA">DANA</option>
    </select>`,
    focusConfirm: false,
    preConfirm: () => {
      const nama = document.querySelector('#swal-input-name').value.trim();
      const nohp = document.querySelector('#swal-input-nohp').value.trim();
      const alamat = document.querySelector('#swal-input-address').value.trim();
      const method = document.querySelector('#swal-payment-method').value.trim();

      if (!nama || !nohp || !alamat || !method) {
        Swal.showValidationMessage('Informasi Pelanggan Wajib Diisi!');
        return false;
      }

      return { nama, nohp, alamat, method};
    }
  }).then((inputResult) => {
    if (!inputResult.isConfirmed) return;
    const { nama, nohp, alamat, method } = inputResult.value;
    const cartSummary = [];
    let totalHarga = 0;

    for (const name in cartItems) {
      const item = cartItems[name];
      const subtotal = item.price * item.qty;
      totalHarga += subtotal;
      cartSummary.push(`• ${name} x${item.qty} = IDR ${item.price.toLocaleString()}`);

    }

    const pesanWA = `*Pesanan dari Website OnPoint Cafe Sehat*\n\n*Nama :* ${nama}\n*No Hp :* ${nohp}\n*Alamat :* ${alamat}\n*Pembayaran :* ${method}\n\n${cartSummary.join('\n')}\n\n*Total : IDR ${totalHarga.toLocaleString()}*`;

    Swal.fire({
      title: 'Konfirmasi Pesanan',
      html: `<pre style="text-align:left;white-space:pre-wrap;">${cartSummary.join('\n')}\n\nTotal: IDR ${totalHarga.toLocaleString()}</pre>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Kirim ke WhatsApp',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const waURL = `https://wa.me/6281352554535?text=${encodeURIComponent(pesanWA)}`;
        // reset keranjang
        for (const name in cartItems) {
          delete cartItems[name];
        }
        updateCartIcon();
        renderCart();

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Pesanan dikirim ke WhatsApp',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup:'swal2-toast-custom'
          },
          showClass: {
            popup: 'swal2-animate-slide-in'
          },
          hideClass: {
            popup: 'swal2-animate-slide-out'
          }
        });

        setTimeout(() => {
          window.open(waURL, '_blank');
        }, 1500);
      }
    });
  });
});

// kontak
document.querySelector('#contact-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const nama = document.querySelector('#nama').value.trim();
  const nohp = document.querySelector('#nohp').value.trim();
  const email = document.querySelector('#email').value.trim();
  const pesan = document.querySelector('#pesan').value.trim();

  if (!nama || !nohp  || !pesan) {
    Swal.fire({
      icon: 'qustion',
      title: 'Apa yang Salah?',
      text: 'Sepertinya ada yang belum lengkap nihh..',
    });
    return;
  }

  const text = `
    *Pertanyaan dari Website OnPoint Cafe Sehat*\n
    *Nama :* ${nama}
    *No HP :* ${nohp}
    *Email :* ${email || '-'}

    *Pesan :*
    ${pesan}`;

  const whatsappURL = `https://wa.me/6281352554535?text=${encodeURIComponent(text)}`; // GANTI nomor kamu

  Swal.fire({
    icon: 'success',
    title: 'Pesan dibuka di WhatsApp',
    toast: true,
    position: 'top-end',
    timer: 1500,
    showConfirmButton: false,
    customClass: {
      popup:'swal2-toast-custom'
    },
    showClass: {
      popup: 'swal2-animate-slide-in'
    },
    hideClass: {
      popup: 'swal2-animate-slide-out'
    }
  });

  setTimeout(() => {
    window.open(whatsappURL, '_blank');
  }, 1500);

  this.reset(); // bersihkan form
});
