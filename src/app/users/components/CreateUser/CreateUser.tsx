import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/atoms/Card";
import { Label } from "~/components/atoms/Label";
import { Input } from "~/components/atoms/Input";
import { Textarea } from "~/components/atoms/TextArea";
import { Button } from "~/components/atoms/Button";
import Modal from "~/components/organisms/modal/Modal";
import DatePicker from "~/components/organisms/DatePicker";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateUser: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Osnovne informacije</CardTitle>
          <CardDescription>
            Unesi osnovne informacije za evidenciju volontera
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Ime</Label>
              <Input id="name" placeholder="Unesi ime" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Prezime</Label>
              <Input id="name" placeholder="Unesi prezime" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresa</Label>
              <Input id="address" placeholder="Unesi kućnu adresu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Grad</Label>
              <Input id="city" placeholder="Unesi naziv grada" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Unesi email" type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Tel/Mob</Label>
              <Input id="phone" placeholder="Unesi broj telefona" type="tel" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Tel/Mob</Label>
              <DatePicker />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Godina početka volontiranja</Label>
              <Input
                id="startDate"
                placeholder="Unesi godinu"
                type="number"
                min={1970}
                max={2500}
              />
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="file">Add Certificate</Label>
                <Input id="file" type="file" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter your description"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex space-x-2">
          <Button>Save</Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default CreateUser;
