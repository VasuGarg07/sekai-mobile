import type { TextInputProps } from "react-native";

import { TextField } from "@/components/ui/text-field";

interface EmailFieldProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (email: string) => void;
}

export function EmailField(props: EmailFieldProps) {
  return (
    <TextField
      label="Email"
      icon="mail"
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      textContentType="emailAddress"
      {...props}
    />
  );
}
