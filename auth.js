<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCErN_tprMGbQ_3mHp0MNwPoHqJgNHQtog",
    authDomain: "biz-membership.firebaseapp.com",
    projectId: "biz-membership",
    storageBucket: "biz-membership.firebasestorage.app",
    messagingSenderId: "645617827043",
    appId: "1:645617827043:web:c932d09356c2d4e29bd9d6",
    measurementId: "G-B77GYG8H5H"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
