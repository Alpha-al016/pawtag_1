console.log('Sprint1A');
const SUPABASE_URL = 'https://cmyxgygopwutjqzjjgsu.supabase.co';
const SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNteXhneWdvcHd1dGpxempqZ3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjE3MzUsImV4cCI6MjEwMTkzNzczNX0.Eh9JfMnlMXHMZvYq3BrDQ_hQ876wWzVn95S17FYKXlo';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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