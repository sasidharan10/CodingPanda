document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.querySelector('.editReview');
    const editButton = document.querySelector('.editButton');
    const reviewContainer = document.querySelector('.review');
    editForm.style.display = 'none';
    editButton.addEventListener('click', () => {
        editForm.style.display = 'block';
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);

        try {
            const response = await fetch('/edit-review', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                reviewContainer.innerHTML = data.updatedReview;
                editForm.style.display = 'none';
            } else {
                console.error('Error updating review.');
            }
        } catch (error) {
            console.error('Error updating review.', error);
        }
    });
});
