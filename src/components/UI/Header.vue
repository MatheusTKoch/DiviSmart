<script setup lang="ts">
import api from "../../api/main";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const dropdownOpen = ref(false);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

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

                <div v-if="showPerfil" class="profile-dropdown-container">
          <button class="profile-button" @click="toggleDropdown">
            <span>Perfil</span>
            <svg
              class="dropdown-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="currentColor"
            >
              <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
            </svg>
          </button>
          <div v-if="dropdownOpen" class="dropdown-menu">
            <button class="dropdown-item" @click="router.push('/menu/edit-profile'); dropdownOpen = false;">
              Editar Perfil
            </button>
            <button class="dropdown-item" @click="router.push('/reset-password'); dropdownOpen = false;">
              Redefinir Senha
            </button>
            <button class="dropdown-item btn-logout" @click="clearUser">
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
        </div>

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

.profile-dropdown-container {
  position: relative;
}

.profile-button {
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

.profile-button:hover {
  background: #f8fafc;
  color: #020617;
  border-color: #f8fafc;
}

.dropdown-icon {
  transition: transform 0.3s ease;
}

.profile-button:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 1000;
  padding: 10px 0;
  margin-top: 10px;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 20px;
  color: #f8fafc;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-item.btn-logout {
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
}

.dropdown-item.btn-logout:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-item.btn-logout .logout-icon {
  transition: transform 0.3s ease;
}

.dropdown-item.btn-logout:hover .logout-icon {
  transform: translateX(3px);
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
