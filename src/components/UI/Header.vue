<script setup lang="ts">
import api from "../../api/main";
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  showLogin: Boolean,
  showPerfil: Boolean,
});

function clearUser() {
  api
    .post("/logout")
    .then((res) => {
      if (res.status == 200) {
        router.push("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <header class="header-container">
    <nav class="nav-content">
      <div class="logo">
        <RouterLink class="logo-link" to="/">DiviSmart</RouterLink>
      </div>

      <div class="actions">
        <button
          v-if="showLogin"
          class="btn-action"
          @click="router.push('/login')"
        >
          Login
        </button>

        <button v-if="showPerfil" class="btn-logout" @click="clearUser">
          <span>Sair</span>
          <svg
            class="logout-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 -960 960 960"
            width="20"
            fill="currentColor"
          >
            <path
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
            />
          </svg>
        </button>
      </div>
    </nav>
    <div class="header-border"></div>
  </header>
</template>

<style scoped>
.header-container {
  width: 100%;
  background: transparent;
  padding: 0 5%;
  padding-top: 20px;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo-link {
  text-decoration: none;
  color: #f8fafc;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  transition: opacity 0.3s;
}

.logo-link:hover {
  opacity: 0.8;
}

.btn-action,
.btn-logout {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-action:hover,
.btn-logout:hover {
  background: #f8fafc;
  color: #020617;
  border-color: #f8fafc;
}

.logout-icon {
  transition: transform 0.3s ease;
}

.btn-logout:hover .logout-icon {
  transform: translateX(3px);
}

.header-border {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  margin-top: 10px;
}

@media screen and (max-width: 480px) {
  .header-container {
    padding: 15px 20px 0;
  }

  .logo-link {
    font-size: 1.2rem;
  }

  .btn-action,
  .btn-logout {
    padding: 6px 14px;
    font-size: 0.8rem;
  }
}
</style>
