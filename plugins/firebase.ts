import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// Importe outros serviços do Firebase que você precisar (Auth, etc.)

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();

  // Suas credenciais do Firebase devem estar nas variáveis de ambiente
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId, // Opcional
  };

  let app: FirebaseApp;
  let firestore: Firestore;
  let storage: FirebaseStorage;

  try {
    app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    storage = getStorage(app);
    // auth = getAuth(app);
  } catch (e) {
    console.error("Erro ao inicializar o Firebase:", e);
    // Se já estiver inicializado (por causa do HMR, por exemplo)
    // app = getApps()[0]; // Você pode precisar de getApps
    // firestore = getFirestore(app);
    // storage = getStorage(app);
  }


  // Disponibilize as instâncias para uso na sua aplicação
  // Você pode injetá-los no contexto do Nuxt ou retornar como provide
  nuxtApp.provide('firebaseApp', app!);
  nuxtApp.provide('firestore', firestore!);
  nuxtApp.provide('storage', storage!);
  // nuxtApp.provide('auth', auth);

  // Ou, para usar com useNuxtApp().$firestore
  // return {
  //   provide: {
  //     firebaseApp: app,
  //     firestore: firestore,
  //     storage: storage,
  //   }
  // }
});