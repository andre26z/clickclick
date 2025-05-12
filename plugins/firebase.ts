// ~/plugins/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage'; // Removido pois a store não usa mais

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	const firebaseConfig = {
		apiKey: config.public.firebaseApiKey,
		authDomain: config.public.firebaseAuthDomain,
		projectId: config.public.firebaseProjectId,
		storageBucket: config.public.firebaseStorageBucket,
		messagingSenderId: config.public.firebaseMessagingSenderId,
		appId: config.public.firebaseAppId,
		measurementId: config.public.firebaseMeasurementId,
	};

	let app: FirebaseApp;
	let firestore: Firestore | undefined = undefined; // Inicia como undefined
	// let storage: FirebaseStorage | undefined = undefined;

	// Verifica se já existem apps Firebase inicializados
	if (!getApps().length) {
		try {
			console.log('Firebase: Inicializando novo app...');
			app = initializeApp(firebaseConfig);
		} catch (e) {
			console.error('Firebase: Erro CRÍTICO ao inicializar novo app Firebase:', e);
			// Neste caso, 'app' pode permanecer undefined, e consequentemente 'firestore' também.
			// A aplicação precisa lidar com a ausência do Firestore.
		}
	} else {
		console.log('Firebase: Obtendo app já inicializado.');
		app = getApp(); // Obtém o app padrão já inicializado
	}

	// Tenta obter o Firestore apenas se o app foi inicializado com sucesso
	if (app!) {
		// Usando app! aqui, assumindo que se chegou aqui, app deve estar definido.
		// Ou adicione uma verificação if (app)
		try {
			firestore = getFirestore(app);
			// storage = getStorage(app);
			console.log('Firebase: Instância do Firestore obtida.');
		} catch (e) {
			console.error('Firebase: Erro ao obter instância do Firestore:', e);
			// firestore (e/ou storage) pode permanecer undefined.
		}
	} else {
		console.error('Firebase: App não inicializado, não é possível obter Firestore.');
	}

	// Disponibiliza as instâncias. Elas podem ser undefined se a inicialização falhou.
	// A store e outras partes do código que usam $firestore precisarão verificar se ele existe.
	nuxtApp.provide('firebaseApp', app!); // Ou apenas app, se preferir não usar '!'
	nuxtApp.provide('firestore', firestore); // Removido '!' para permitir undefined e forçar a verificação
	// nuxtApp.provide('storage', storage);
});
