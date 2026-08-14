console.log('Sprint1A');
// ================= FAQ =================

const questions = document.querySelectorAll(".faq-question");

questions.forEach(question => {

    question.addEventListener("click", () => {

        const answer = question.nextElementSibling;

        if(answer.style.display === "block"){

            answer.style.display = "none";

        }else{

            answer.style.display = "block";

        }

    });

});

// ================= NAVBAR SCROLL =================

window.addEventListener("scroll", function(){

    const navbar = document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.padding = "15px 8%";

    }

    else{

        navbar.style.padding = "20px 8%";

    }

});