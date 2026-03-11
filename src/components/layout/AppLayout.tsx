import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    return (
        <div className="flex h-screen bg-slate-950">
            {/* Sidebar here*/}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;