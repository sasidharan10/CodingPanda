$(document).ready(function () {
    // Disable form submission and handle validation
    $(".registerForm").submit(function (event) {
        event.preventDefault();
        validateFirstName();
        validateLastName();
        validateEmail();
        validatePassword();
        validateRepeatPassword();
    });

    // Real-time validation on input change
    $("#firstName").on("input", function () {
        validateFirstName();
    });

    $("#lastName").on("input", function () {
        validateLastName();
    });

    $("#email").on("input", function () {
        validateEmail();
    });

    $("#password").on("input", function () {
        validatePassword();
    });

    $("#repeatPassword").on("input", function () {
        validateRepeatPassword();
    });


    function validateFirstName() {
        const nameInput = $("#firstName");
        const nameFeedback = $(".firstName-feedback");

        if (nameInput.val() === "") {
            nameInput.addClass("is-invalid");
            nameInput.removeClass("is-valid");
            nameFeedback.text("Name cannot be empty");
        } else if (!/^[A-Za-z]+$/.test(nameInput.val())) {
            nameInput.addClass("is-invalid");
            nameInput.removeClass("is-valid");
            nameFeedback.text("Only Alphabets allowed");
        } else {
            nameInput.removeClass("is-invalid");
            nameInput.addClass("is-valid");
        }
    }

    function validateLastName() {
        const nameInput = $("#lastName");

        if (nameInput.val() === "") {
            nameInput.addClass("is-valid");
            nameInput.removeClass("is-invalid");
        } else if (!/^[A-Za-z]+$/.test(nameInput.val())) {
            nameInput.addClass("is-invalid");
            nameInput.removeClass("is-valid");
        } else {
            nameInput.removeClass("is-invalid");
            nameInput.addClass("is-valid");
        }
    }

    // Validate Email
    function validateEmail() {
        var emailInput = $("#email");
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.val())) {
            emailInput.removeClass("is-valid").addClass("is-invalid");
            validForm = false;
        } else {
            emailInput.removeClass("is-invalid").addClass("is-valid");
        }
    }

    // Validate Password
    function validatePassword() {
        var passwordInput = $("#password");
        var passwordFeedback = $(".password-feedback");
        if (passwordInput.val() === "") {
            passwordInput.addClass("is-invalid");
            passwordInput.removeClass("is-valid");
            passwordFeedback.text("Please Enter Password");
        } else if (passwordInput.val().length < 4) {
            passwordInput.removeClass("is-valid").addClass("is-invalid");
            passwordFeedback.text("Password should be alteast 4 characters");
            validForm = false;
        } else {
            passwordInput.removeClass("is-invalid").addClass("is-valid");
        }
    }

    function validateRepeatPassword() {
        const passwordInput = $("#password");
        const repeatPasswordInput = $("#repeatPassword");
        const repeatPasswordFeedback = $(".repeatPassword-feedback");

        if (repeatPasswordInput.val() === "") {
            repeatPasswordInput.addClass("is-invalid");
            repeatPasswordInput.removeClass("is-valid");
            repeatPasswordFeedback.text("Please Re-enter Password");
        } else if (passwordInput.val() !== repeatPasswordInput.val()) {
            repeatPasswordInput.removeClass("is-valid");
            repeatPasswordInput.addClass("is-invalid");
            repeatPasswordFeedback.text("Password Mismatch");
        } else {
            repeatPasswordInput.removeClass("is-invalid");
            repeatPasswordInput.addClass("is-valid");
        }
    }


});