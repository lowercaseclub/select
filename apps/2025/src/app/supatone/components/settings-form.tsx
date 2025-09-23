"use client";

import { Controller, Control } from "react-hook-form";
import { Slider } from "@repo/ui/src/components/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/src/components/select";
import { ShapeSelect } from "./shape-select";

type FormData = {
  spacing: number;
  dotSize: number;
  size: number;
  shape: "circle" | "square";
  uniformSize: boolean;
};

interface SettingsFormProps {
  control: Control<FormData>;
  onSettingsChange: () => void;
}

export function SettingsForm({ control, onSettingsChange }: SettingsFormProps) {
  return (
    <div className="mb-8 p-6 border border-column-lines">
      <h2 className="text-xl font-medium mb-4 font-mono">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">
            Spacing
          </label>
          <Controller
            name="spacing"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                    onSettingsChange();
                  }}
                  min={2}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground font-mono">
                  {field.value}
                </span>
              </div>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">
            Dot Size
          </label>
          <Controller
            name="dotSize"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                    onSettingsChange();
                  }}
                  min={0.5}
                  max={4}
                  step={0.25}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground font-mono">
                  {field.value}
                </span>
              </div>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">
            Size
          </label>
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value.toString()}
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                  onSettingsChange();
                }}
              >
                <SelectTrigger className="w-full bg-black border-column-lines font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-column-lines">
                  <SelectItem value="200" className="font-mono">
                    200px
                  </SelectItem>
                  <SelectItem value="400" className="font-mono">
                    400px
                  </SelectItem>
                  <SelectItem value="600" className="font-mono">
                    600px
                  </SelectItem>
                  <SelectItem value="800" className="font-mono">
                    800px
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">
            Shape
          </label>
          <Controller
            name="shape"
            control={control}
            render={({ field }) => (
              <ShapeSelect
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onSettingsChange();
                }}
              />
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">
            Size Mode
          </label>
          <Controller
            name="uniformSize"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? "uniform" : "variable"}
                onValueChange={(value) => {
                  field.onChange(value === "uniform");
                  onSettingsChange();
                }}
              >
                <SelectTrigger className="w-full bg-black border-column-lines font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-column-lines">
                  <SelectItem value="variable" className="font-mono">
                    Variable
                  </SelectItem>
                  <SelectItem value="uniform" className="font-mono">
                    Uniform
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
