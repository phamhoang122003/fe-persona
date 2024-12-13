import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';  // Sửa tên trùng lặp
import TaskDetailView from '@/views/TaskDetailView.vue';
import TaskCreateView from '@/views/TaskCreateView.vue';
import NotificationView from '@/views/NotificationView.vue';
import NotificationDetailView from '@/views/NotificationDetailView.vue';
import NotificationCreateView from '@/views/NotificationCreateView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ForGotPassWordView from '@/views/ForGotPassWordView.vue';
import NewPasswordView from '@/views/NewPasswordView.vue';
import ListUserView from '@/views/ListUserView.vue';
import UpdateInfomation from '@/views/updateInfomation.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/reset-password/:userId/:token', name: 'ResetPassword', component: NewPasswordView },
    { path: '/forgot-password', name: 'forgot-password', component: ForGotPassWordView },
    { path: '/list-user', name: 'users', component: ListUserView, meta: { requiresAuth: true } },
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/detail-user', name: 'UserDetail', component: UpdateInfomation, meta: { requiresAuth: true } },
    { path: '/task-detail/:id', name: 'TaskDetail', component: TaskDetailView, meta: { requiresAuth: true } },
    { path: '/task-create', name: 'TaskCreate', component: TaskCreateView, meta: { requiresAuth: true } },
    { path: '/task-update/:id', name: 'TaskUpdate', component: TaskCreateView, meta: { requiresAuth: true } },
    { path: '/notification', name: 'NotificationView', component: NotificationView, meta: { requiresAuth: true } },
    { path: '/notification-detail/:id', name: 'NotificationDetail', component: NotificationDetailView, meta: { requiresAuth: true } },
    { path: '/notification-create/:taskId', name: 'NotificationCreate', component: NotificationCreateView, meta: { requiresAuth: true } },
    { path: '/notification-update/:id', name: 'NotificationUpdate', component: NotificationCreateView, meta: { requiresAuth: true } },
    { path: '/notification-task/:id', name: 'NotificationTaskView', component: NotificationView, meta: { requiresAuth: true } },
  ]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  if ((to.meta.requiresAuth && !token) && to.name !== 'login' && to.name !== 'forgot-password') {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
