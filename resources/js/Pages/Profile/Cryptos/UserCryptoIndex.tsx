import { Network, UserCrypto } from '@/types/crypto';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import AddCryptoDialog from './Partials/AddCryptoDialog';
import CryptoList from './Partials/CryptoList';
import EmptyState from '@/Components/EmptyState';

interface Props extends PageProps {
    cryptos: UserCrypto[];
    networks: Network[];
}

export default function UserCryptoIndex({ cryptos, networks, auth }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">{t('crypto.title')}</h2>}
        >
            <Head title={t('crypto.title')} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-2xl font-bold">
                                {t('crypto.my_addresses')}
                            </CardTitle>
                            <Button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="bg-primary hover:bg-primary/90"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                {t('crypto.add_new')}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {cryptos.length > 0 ? (
                                <CryptoList
                                    cryptos={cryptos}
                                    networks={networks}
                                />
                            ) : (
                                <EmptyState
                                    title={t('crypto.empty.title')}
                                    description={t('crypto.empty.description')}
                                    icon="Wallet"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AddCryptoDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                networks={networks}
            />
        </AuthenticatedLayout>
    );
}
