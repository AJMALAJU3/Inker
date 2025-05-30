import {RouterProvider} from 'react-router-dom'
import {router} from './router/AppRoutes'
import {ThemeProvider} from "@/components/user/common/theme-provider";
import './App.css'
import {Toaster} from 'sonner'
import {Provider} from 'react-redux'
import {store} from './store/store.ts'
import useAuthStore from "@/store/authStore.ts";
import Loader from "@/components/user/common/Loader.tsx";

function App() {
    const {isLoading} = useAuthStore();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="max-w-[200px]"/>
            </div>
        );
    }

    return (
        <Provider store={store}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <RouterProvider router={router}/>
            </ThemeProvider>
            <Toaster richColors/>
        </Provider>
    );
}

export default App
