const districtLinks = document.querySelectorAll('.districts-navigation a');

districtLinks.forEach((link) => {
	link.addEventListener('click', () => {
		districtLinks.forEach((item) => item.classList.remove('is-active'));
		link.classList.add('is-active');
	});
});

const districtCards = document.querySelectorAll('.district-placeholder.is-filled');
const districtModal = document.querySelector('.district-modal');

if (districtModal && districtCards.length) {
	const modalImage = districtModal.querySelector('.district-modal-image');
	const modalTitle = districtModal.querySelector('#district-modal-title');
	const modalNumber = districtModal.querySelector('.district-modal-number');
	const modalDescription = districtModal.querySelector('#district-modal-description');
	const closeButton = districtModal.querySelector('.district-modal-close');
	let activeCard = null;

	const closeModal = () => {
		districtModal.classList.remove('is-open');
		districtModal.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		activeCard?.focus();
	};

	const openModal = (card) => {
		const image = card.querySelector('.district-image');
		const number = card.querySelector('span')?.textContent.trim() || '';

		activeCard = card;
		modalImage.src = image.src;
		modalImage.alt = image.alt;
		modalTitle.textContent = `DISTRITO ${number}`;
		modalNumber.textContent = number;
		modalDescription.replaceChildren();
		const description = card.dataset.description || 'Próximamente vas a poder conocer la historia, la industria y los símbolos de este distrito.';
		const emphasis = card.dataset.emphasis;

		if (emphasis && description.includes(emphasis)) {
			const [before, after] = description.split(emphasis);
			modalDescription.append(before, Object.assign(document.createElement('strong'), { textContent: emphasis }), after);
		} else {
			modalDescription.textContent = description;
		}
		districtModal.classList.add('is-open');
		districtModal.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		closeButton.focus();
	};

	districtCards.forEach((card) => {
		card.setAttribute('role', 'button');
		card.setAttribute('tabindex', '0');
		card.setAttribute('aria-haspopup', 'dialog');
		card.addEventListener('click', () => openModal(card));
		card.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openModal(card);
			}
		});
	});

	closeButton.addEventListener('click', closeModal);
	districtModal.addEventListener('click', (event) => {
		if (event.target === districtModal) closeModal();
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && districtModal.classList.contains('is-open')) closeModal();
	});
}

const homeCharacterTriggers = document.querySelectorAll('.home-character-trigger');

homeCharacterTriggers.forEach((trigger) => {
	const modal = document.querySelector(`#${trigger.dataset.characterModal}`);
	if (!modal) return;

	const closeButton = modal.querySelector('.home-character-modal-close');
	const closeModal = () => {
		modal.classList.remove('is-open');
		modal.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		trigger.focus();
	};
	const openModal = () => {
		modal.classList.add('is-open');
		modal.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		closeButton.focus();
	};

	trigger.addEventListener('click', openModal);
	trigger.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openModal();
		}
	});
	closeButton.addEventListener('click', closeModal);
	modal.addEventListener('click', (event) => {
		if (event.target === modal) closeModal();
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
	});
});

const galleryItems = document.querySelectorAll('.gallery-placeholder.is-filled');
const galleryModal = document.querySelector('.gallery-modal');

if (galleryModal && galleryItems.length) {
	const modalImage = galleryModal.querySelector('.gallery-modal-image');
	const closeButton = galleryModal.querySelector('.gallery-modal-close');
	const downloadLink = galleryModal.querySelector('.gallery-modal-download');
	const shareButton = galleryModal.querySelector('.gallery-modal-share');
	const favoriteButton = galleryModal.querySelector('.gallery-modal-favorite');
	const status = galleryModal.querySelector('.gallery-modal-status');
	let activeItem = null;

	const closeModal = () => {
		galleryModal.classList.remove('is-open');
		galleryModal.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
		activeItem?.focus();
	};

	const openModal = (item) => {
		const image = item.querySelector('img');
		activeItem = item;
		modalImage.src = image.currentSrc || image.src;
		modalImage.alt = image.alt;
		downloadLink.href = modalImage.src;
		downloadLink.download = image.src.split('/').pop();
		const isFavorite = item.dataset.favorite === 'true';
		favoriteButton.setAttribute('aria-pressed', String(isFavorite));
		favoriteButton.textContent = isFavorite ? '♥ En favoritos' : '♡ Favorito';
		status.textContent = '';
		galleryModal.classList.add('is-open');
		galleryModal.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		closeButton.focus();
	};

	galleryItems.forEach((item) => {
		item.setAttribute('role', 'button');
		item.setAttribute('tabindex', '0');
		item.setAttribute('aria-haspopup', 'dialog');
		item.addEventListener('click', () => openModal(item));
		item.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openModal(item);
			}
		});
	});

	closeButton.addEventListener('click', closeModal);
	galleryModal.addEventListener('click', (event) => {
		if (event.target === galleryModal) closeModal();
	});
	favoriteButton.addEventListener('click', () => {
		if (!activeItem) return;
		const isFavorite = activeItem.dataset.favorite === 'true';
		activeItem.dataset.favorite = String(!isFavorite);
		favoriteButton.setAttribute('aria-pressed', String(!isFavorite));
		favoriteButton.textContent = !isFavorite ? '♥ En favoritos' : '♡ Favorito';
		status.textContent = !isFavorite ? 'Imagen agregada a favoritos.' : 'Imagen eliminada de favoritos.';
	});
	shareButton.addEventListener('click', async () => {
		const shareData = { title: 'The Hunger Games - Galería', url: modalImage.src };
		try {
			if (navigator.share) {
				await navigator.share(shareData);
				status.textContent = 'Imagen compartida.';
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(modalImage.src);
				status.textContent = 'Enlace copiado para compartir.';
			} else {
				status.textContent = 'Copiá la dirección de la imagen desde el navegador para compartirla.';
			}
		} catch (error) {
			if (error.name !== 'AbortError') status.textContent = 'No se pudo compartir la imagen.';
		}
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && galleryModal.classList.contains('is-open')) closeModal();
	});
}

const galleryPages = document.querySelectorAll('.gallery-page-grid');
const galleryTrack = document.querySelector('.gallery-carousel-track');
const galleryPrevious = document.querySelector('.gallery-page-previous');
const galleryNext = document.querySelector('.gallery-page-next');
const galleryPageIndicator = document.querySelector('.gallery-page-indicator');

if (galleryPages.length && galleryTrack && galleryPrevious && galleryNext && galleryPageIndicator) {
	let currentPage = 0;
	const showPage = (pageIndex) => {
		currentPage = pageIndex;
		galleryPages.forEach((page, index) => {
			const isActive = index === currentPage;
			page.classList.toggle('is-active', isActive);
			page.setAttribute('aria-hidden', String(!isActive));
		});
		galleryTrack.style.setProperty('--gallery-page', currentPage);
		galleryPrevious.disabled = currentPage === 0;
		galleryNext.disabled = currentPage === galleryPages.length - 1;
		galleryPageIndicator.textContent = `${currentPage + 1} / ${galleryPages.length}`;
	};

	galleryPrevious.addEventListener('click', () => showPage(currentPage - 1));
	galleryNext.addEventListener('click', () => showPage(currentPage + 1));
}

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
	const status = contactForm.querySelector('.contact-form-status');
	contactForm.addEventListener('submit', (event) => {
		event.preventDefault();
		status.textContent = '¡Gracias! Recibimos tus datos y nos pondremos en contacto pronto.';
		contactForm.reset();
	});
}

const movieTrailerTriggers = document.querySelectorAll('.movie-trailer-trigger');
const movieModal = document.querySelector('.movie-modal');

if (movieModal && movieTrailerTriggers.length) {
	const modalTitle = movieModal.querySelector('#movie-modal-title');
	const modalFrame = movieModal.querySelector('iframe');
	const closeButton = movieModal.querySelector('.movie-modal-close');
	let activeTrigger = null;

	const closeModal = () => {
		movieModal.classList.remove('is-open');
		movieModal.setAttribute('aria-hidden', 'true');
		modalFrame.src = '';
		document.body.style.overflow = '';
		activeTrigger?.focus();
	};

	movieTrailerTriggers.forEach((trigger) => {
		trigger.addEventListener('click', () => {
			activeTrigger = trigger;
			modalTitle.textContent = trigger.dataset.trailerTitle;
			modalFrame.title = `Trailer oficial de ${trigger.dataset.trailerTitle}`;
			modalFrame.src = `https://www.youtube-nocookie.com/embed/${trigger.dataset.trailerId}?autoplay=1&rel=0`;
			movieModal.classList.add('is-open');
			movieModal.setAttribute('aria-hidden', 'false');
			document.body.style.overflow = 'hidden';
			closeButton.focus();
		});
	});

	closeButton.addEventListener('click', closeModal);
	movieModal.addEventListener('click', (event) => {
		if (event.target === movieModal) closeModal();
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && movieModal.classList.contains('is-open')) closeModal();
	});
}
