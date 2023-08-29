$(document).ready(function () {

    $(".registerForm").submit(function (event) {
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

        event.preventDefault();
        let r1 = validateFirstName();
        let r2 = validateLastName();
        let r3 = validateEmail();
        let r4 = validatePassword();
        let r5 = validateRepeatPassword();
        if ((r1 && r2 && r3 && r4 && r5))
            this.submit();
    });

    function validateFirstName() {
        const nameInput = $("#firstName");
        const nameFeedback = $(".firstName-feedback");

        if (nameInput.val() === "") {
            nameInput.addClass("is-invalid");
            nameInput.removeClass("is-valid");
            nameFeedback.text("Name cannot be empty");
            return false;
        } else if (!/^[A-Za-z]+$/.test(nameInput.val())) {
            nameInput.addClass("is-invalid");
            nameInput.removeClass("is-valid");
            nameFeedback.text("Only Alphabets allowed");
            return false;
        } else {
            nameInput.removeClass("is-invalid");
            nameInput.addClass("is-valid");
            return true;
        }
    }

    function validateLastName() {
        const nameInput = $("#lastName");

        if (nameInput.val() === "") {
            nameInput.addClass("is-valid");
            nameInput.removeClass("is-invalid");
            return false;
        } else if (!/^[A-Za-z]+$/.test(nameInput.val())) {
            nameInput.addClass("is-invalid");
            nameInput.removeClass("is-valid");
            return false;
        } else {
            nameInput.removeClass("is-invalid");
            nameInput.addClass("is-valid");
            return true;
        }
    }

    // Validate Email
    function validateEmail() {
        var emailInput = $("#email");
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.val())) {
            emailInput.removeClass("is-valid").addClass("is-invalid");
            return false;
        } else {
            emailInput.removeClass("is-invalid").addClass("is-valid");
            return true;
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
            return false;
        } else if (passwordInput.val().length < 4) {
            passwordInput.removeClass("is-valid").addClass("is-invalid");
            passwordFeedback.text("Password should be alteast 4 characters");
            return false;
        } else {
            passwordInput.removeClass("is-invalid").addClass("is-valid");
            return true;
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
            return false;
        } else if (passwordInput.val() !== repeatPasswordInput.val()) {
            repeatPasswordInput.removeClass("is-valid");
            repeatPasswordInput.addClass("is-invalid");
            repeatPasswordFeedback.text("Password Mismatch");
            return false;
        } else {
            repeatPasswordInput.removeClass("is-invalid");
            repeatPasswordInput.addClass("is-valid");
            return true;
        }
    }

});