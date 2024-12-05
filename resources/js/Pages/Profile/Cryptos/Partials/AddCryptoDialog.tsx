import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../Components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Network } from '@/types/crypto';
import { useForm } from '@inertiajs/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    networks: Network[];
}

export default function AddCryptoDialog({ isOpen, onClose, networks }: Props) {
    const form = useForm({
        network_id: '',
        address: '',
        title: '',
        is_default: false,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('profile.cryptos.store'), {
            onSuccess: () => {
                onClose();
                form.reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('crypto.add_new')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <FormField
                            name="network_id"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('crypto.network')}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'crypto.select_network',
                                                    )}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {networks.map((network) => (
                                                <SelectItem
                                                    key={network.id}
                                                    value={network.id}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <img
                                                            src={network.icon}
                                                            alt={network.name}
                                                            className="h-4 w-4"
                                                        />
                                                        <span>
                                                            {network.name}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="address"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('crypto.address')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('crypto.title')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="is_default"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            {t('crypto.set_as_default')}
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={form.processing}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {t('common.save')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
