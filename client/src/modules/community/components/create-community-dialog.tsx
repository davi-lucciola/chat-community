import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type CreateCommunityDTO, createCommunitySchema } from '../community.schema';
import communityService from '../community.service';

export function CreateCommunityDialog() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: createCommunity, isPending } = useMutation({
    mutationKey: ['community', 'create'],
    mutationFn: communityService.createCommunity,
  });

  const form = useForm({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (payload: CreateCommunityDTO) => {
    await createCommunity(payload);
    await queryClient.refetchQueries({ queryKey: ['communities'] });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4 mr-2" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
            <DialogDescription>
              Create your own community here. Click create when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title"> Title </FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Title of your community"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description"> Description </FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Describe your community here"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="hover:cursor-pointer">
              Create
              {isPending && <Loader className="animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
