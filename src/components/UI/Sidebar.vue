<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api/main";

defineProps({
  isDemo: {
    type: Boolean,
    default: false,
  },
});

let activeItem = ref("menu");
const route = useRoute();
const router = useRouter();
const logoUrl = `${import.meta.env.BASE_URL}favicon.svg`;

onMounted(() => {
  activeItem.value =
    route.path === "/menu" ? "menu" : route.path.replace("/menu/", "");
});

function goToAccount() {
  api
    .post("/logout")
    .then((res) => {
      if (res.status == 200) {
        localStorage.removeItem("auth_token");
        router.push("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <ul class="nav-list">
        <li :class="{ active: activeItem === 'menu' }">
          <RouterLink to="/menu" @click="activeItem = 'menu'" class="nav-link">
            <svg
              class="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path
                d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
              />
            </svg>
            <span>Dashboard</span>
          </RouterLink>
        </li>

        <li :class="{ active: activeItem === 'carteira' }">
          <RouterLink
            to="/menu/carteira"
            @click="activeItem = 'carteira'"
            class="nav-link"
          >
            <svg
              class="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path
                d="M200-200v-560 560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v100h-80v-100H200v560h560v-100h80v100q0 33-23.5 56.5T760-120H200Zm320-160q-33 0-56.5-23.5T440-360v-240q0-33 23.5-56.5T520-680h280q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280H520Zm280-80v-240H520v240h280Zm-160-60q25 0 42.5-17.5T700-480q0-25-17.5-42.5T640-540q-25 0-42.5 17.5T580-480q0 25 17.5 42.5T640-420Z"
              />
            </svg>
            <span>Carteira</span>
          </RouterLink>
        </li>

        <li :class="{ active: activeItem === 'acompanhamento' }">
          <RouterLink
            to="/menu/acompanhamento"
            @click="activeItem = 'acompanhamento'"
            class="nav-link"
          >
            <svg
              class="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path
                d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480H480v400Zm0-80v-320h320q0 66-24.5 123t-67 100.5q-42.5 43.5-99 68.5T480-160Zm0-400v-320q66 0 123 24.5t99.5 68.5q42.5 44 67 100.5T794-560H480Z"
              />
            </svg>
            <span>Acompanhamento</span>
          </RouterLink>
        </li>

        <li :class="{ active: activeItem === 'dividendos' }">
          <RouterLink
            to="/menu/dividendos"
            @click="activeItem = 'dividendos'"
            class="nav-link"
          >
            <svg
              class="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path
                d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
              />
            </svg>
            <span>Dividendos</span>
          </RouterLink>
        </li>

        <li :class="{ active: activeItem === 'analise-ativos' }">
          <RouterLink
            to="/menu/analiseativos"
            @click="activeItem = 'analise-ativos'"
            class="nav-link"
          >
            <svg
              class="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path
                d="M280-280h80v-200h-80v200Zm160 0h80v-400h-80v400Zm160 0h80v-320h-80v320ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
              />
            </svg>
            <span>Análise de Ativos</span>
          </RouterLink>
        </li>

        <li :class="{ active: activeItem === 'relatorios' }">
          <RouterLink
            to="/menu/relatorios"
            @click="activeItem = 'relatorios'"
            class="nav-link"
          >
            <svg
              class="nav-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path
                d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"
              />
            </svg>
            <span>Relatórios</span>
          </RouterLink>
        </li>
      </ul>

      <div class="footer-sidebar" :class="{ 'footer-sidebar--demo': isDemo }">
        <p v-if="isDemo" class="demo-cta">
          Gostou da experiência?
          <button type="button" class="demo-cta-link" @click="goToAccount">
            Crie sua conta ou faça login
          </button>
        </p>
        <div class="footer-meta">
          <span class="version">V 1.0.0</span>
          <div class="brand-lockup sidebar-brand">
            <img :src="logoUrl" alt="" class="brand-mark brand-mark--sm" width="20" height="20" />
            <span class="brand">DiviSmart</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 100%;
  background: var(--bg-deep);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  transition: all 0.3s ease;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.nav-list {
  list-style: none;
  padding: 0 15px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-icon {
  flex-shrink: 0;
  color: #64748b;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.03);
}

.nav-link:hover .nav-icon {
  color: var(--accent);
}

li.active .nav-link {
  color: var(--text-main);
  background: rgba(59, 130, 246, 0.12);
}

li.active .nav-icon {
  color: var(--accent);
}

.footer-sidebar {
  padding: 20px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.demo-cta {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: #64748b;
}

.demo-cta-link {
  display: inline;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  color: var(--accent);
  font-size: inherit;
  font-weight: 600;
  line-height: inherit;
  cursor: pointer;
  text-align: left;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s ease, opacity 0.2s ease;
}

.demo-cta-link:hover {
  color: var(--text-main);
  opacity: 0.9;
}

.version {
  font-size: 0.75rem;
  color: #64748b;
}

.sidebar-brand {
  gap: 0.4rem;
}

.brand-mark--sm {
  width: 20px;
  height: 20px;
  border-radius: 5px;
}

.brand {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-soft);
  letter-spacing: 0.04em;
}

@media screen and (max-width: 768px) {
  .sidebar {
    width: 80px;
    min-height: auto;
  }

  .nav-link span,
  .footer-sidebar .brand,
  .footer-sidebar .version {
    display: none;
  }

  .nav-link {
    justify-content: center;
    padding: 15px;
  }

  .footer-sidebar {
    justify-content: center;
    padding: 12px;
  }

  .footer-sidebar--demo {
    align-items: center;
  }

  .footer-sidebar--demo .demo-cta {
    display: block;
    text-align: center;
    font-size: 0.65rem;
    line-height: 1.3;
  }

  .footer-sidebar--demo .footer-meta {
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .sidebar {
    width: 100%;
    padding: 8px 0;
    border-right: 0;
    border-bottom: 1px solid var(--border-subtle);
  }

  .sidebar-content {
    gap: 8px;
  }

  .nav-list {
    flex-direction: row;
    gap: 4px;
    padding: 0 8px;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .nav-list::-webkit-scrollbar {
    display: none;
  }

  .nav-list li {
    flex: 0 0 auto;
  }

  .nav-link {
    min-width: 48px;
    min-height: 44px;
    padding: 10px;
  }

  .footer-sidebar:not(.footer-sidebar--demo) {
    display: none;
  }

  .footer-sidebar--demo {
    display: flex;
    padding: 8px 12px 10px;
    border-top: 1px solid var(--border-subtle);
  }

  .footer-sidebar--demo .footer-meta {
    display: none;
  }

  .footer-sidebar--demo .demo-cta {
    font-size: 0.7rem;
    text-align: center;
    width: 100%;
  }
}
</style>
