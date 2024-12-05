import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { useToast } from '@/Components/ui/use-toast';
import { formatDate } from '@/lib/utils';
import { Network, UserCrypto } from '@/types/crypto';
import { router } from '@inertiajs/react';
import { Copy, ExternalLink, Star, Trash2 } from 'lucide-react';

interface Props {
    cryptos: UserCrypto[];
    networks: Network[];
}

export default function CryptoList({ cryptos, networks }: Props) {
    const { toast } = useToast();

    const getNetwork = (networkId: string) => {
        return networks.find((n) => n.id === networkId);
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast({
            title: t('common.copied'),
            description: t('common.copied_to_clipboard'),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm(t('crypto.confirm_delete'))) {
            router.delete(route('profile.cryptos.destroy', id));
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('crypto.network')}</TableHead>
                        <TableHead>{t('crypto.title')}</TableHead>
                        <TableHead>{t('crypto.address')}</TableHead>
                        <TableHead>{t('common.created_at')}</TableHead>
                        <TableHead className="text-right">
                            {t('common.actions')}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cryptos.map((crypto) => {
                        const network = getNetwork(crypto.network_id);
                        return (
                            <TableRow key={crypto.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center space-x-2">
                                        {network?.icon && (
                                            <img
                                                src={network.icon}
                                                alt={network.name}
                                                className="h-6 w-6"
                                            />
                                        )}
                                        <span>{network?.name}</span>
                                        {crypto.is_default && (
                                            <Star className="h-4 w-4 text-yellow-500" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{crypto.title}</TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <code className="bg-muted rounded px-2 py-1">
                                            {crypto.address.slice(0, 6)}...
                                            {crypto.address.slice(-4)}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                copyToClipboard(crypto.address)
                                            }
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        {network?.explorer_url && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    window.open(
                                                        network.explorer_url +
                                                            crypto.address,
                                                        '_blank',
                                                    )
                                                }
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {formatDate(crypto.created_at)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(crypto.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
