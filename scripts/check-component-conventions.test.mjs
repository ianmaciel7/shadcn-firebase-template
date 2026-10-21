import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  inspectComponent,
  isOwnedComponent,
} from "./check-component-conventions.mjs";

const profile = "src/app/(protected)/profile/_components/profile-card.tsx";
const inspect = (content, file = profile) =>
  inspectComponent(content, file).map((issue) => issue.message);

function expectValid(content, file) {
  assert.deepEqual(inspect(content, file), []);
}

function expectInvalid(content, pattern, file) {
  assert.match(inspect(content, file).join(" "), pattern);
}

describe("owned component conventions", () => {
  it("selects private components and project-owned extensions", () => {
    assert.equal(isOwnedComponent(profile), true);
    assert.equal(
      isOwnedComponent("src/app/_components/home-content.tsx"),
      true,
    );
    assert.equal(
      isOwnedComponent("src/components/ui/extensions/theme-provider.tsx"),
      true,
    );
  });

  it("excludes framework entrypoints, tests and generated registries", () => {
    assert.equal(isOwnedComponent("src/app/page.tsx"), false);
    assert.equal(isOwnedComponent("src/app/_components/card.test.tsx"), false);
    assert.equal(isOwnedComponent("src/components/ui/button.tsx"), false);
    assert.equal(
      isOwnedComponent("src/components/firebase/sign-in-auth-screen.tsx"),
      false,
    );
    assert.equal(
      isOwnedComponent("src/components/ai-elements/message.tsx"),
      false,
    );
  });

  it("allows semantic roles, matching exports and Server Components", () => {
    expectValid(
      '"use client"; type ProfileCardProps = ComponentProps<"div">; function ProfileCard(props: ProfileCardProps) { return <ProfileForm><Card><ProfileFormContent /><ProfileFormFooter><ProfileButton /><SignOutButton /></ProfileFormFooter></Card></ProfileForm>; } export { ProfileCard };',
    );
    expectValid(
      "async function IntlProvider({ children }) { return <Provider>{children}</Provider>; } export { IntlProvider };",
      "src/components/ui/extensions/intl-provider.tsx",
    );
  });

  it("rejects runtime suffixes in component names", () => {
    expectInvalid(
      "function ProfileClient() { return <Card />; } export { ProfileClient };",
      /semantic role/,
      "src/app/(protected)/profile/_components/profile-client.tsx",
    );
    expectInvalid(
      "function AccountServer() { return <div />; } export { AccountServer };",
      /semantic role/,
      "src/app/_components/account-server.tsx",
    );
  });

  it("rejects mismatched names and default exports", () => {
    expectInvalid(
      "function ProfilePanel() { return <Card />; } export { ProfilePanel };",
      /ProfileCard/,
    );
    expectInvalid(
      "export default function ProfileCard() { return <Card />; }",
      /named/,
    );
  });

  it("rejects incorrect props types and filename casing", () => {
    expectInvalid(
      'type WrongProps = ComponentProps<"div">; function ProfileCard() { return <Card />; } export { ProfileCard };',
      /ProfileCardProps/,
    );
    expectInvalid(
      "function ProfileCard() { return <Card />; } export { ProfileCard };",
      /kebab-case/,
      "src/app/_components/ProfileCard.tsx",
    );
  });

  it("permits client interaction but rejects server-only imports", () => {
    expectValid(
      '"use client"; import { useState } from "react"; function ProfileCard() { const [open] = useState(false); return <ProfileForm><Card open={open}><ProfileFormContent /><ProfileFormFooter><ProfileButton /><SignOutButton /></ProfileFormFooter></Card></ProfileForm>; } export { ProfileCard };',
    );
    expectInvalid(
      '"use client"; import { cookies } from "next/headers"; function ProfileCard() { return <Card />; } export { ProfileCard };',
      /server-only/,
    );
    expectInvalid(
      '"use client"; import "server-only"; function ProfileCard() { return <Card />; } export { ProfileCard };',
      /server-only/,
    );
  });

  it("rejects inline exported component declarations", () => {
    expectInvalid(
      "export function ProfileCard() { return <Card />; }",
      /locally/,
    );
  });

  it("rejects arrow-function components and imported re-exports", () => {
    expectInvalid(
      "const ProfileCard = () => <Card />; export { ProfileCard };",
      /local named function/,
    );
    expectInvalid(
      'export { ProfileCard } from "./other-component";',
      /local named function/,
    );
  });
  it("matches a field component to its React Hook Form field name", () => {
    expectValid(
      'function ProfileDisplayNameField() { return <Controller name="displayName" control={control} render={() => <Field />} />; } export { ProfileDisplayNameField };',
      "src/app/(protected)/profile/_components/profile-display-name-field.tsx",
    );
    expectValid(
      "function ProfileAvatarField() { return <Avatar />; } export { ProfileAvatarField };",
      "src/app/(protected)/profile/_components/profile-avatar-field.tsx",
    );
    expectInvalid(
      'function ProfileNameField() { return <Controller name="displayName" control={control} render={() => <Field />} />; } export { ProfileNameField };',
      /must match Controller name/,
      "src/app/(protected)/profile/_components/profile-name-field.tsx",
    );
    expectInvalid(
      'function ProfileDisplayNameField() { return <Controller name="email" control={control} render={() => <Field />} />; } export { ProfileDisplayNameField };',
      /must match Controller name/,
      "src/app/(protected)/profile/_components/profile-display-name-field.tsx",
    );
  });

  it("rejects passing the complete profile controller to a child", () => {
    expectInvalid(
      "function ProfileCard() { return <ProfileForm profile={profile} />; } export { ProfileCard };",
      /focused field\/form\/button props/,
    );
    expectInvalid(
      "function ProfileCard() { return <SignOutButton profile={profile} />; } export { ProfileCard };",
      /focused field\/form\/button props/,
    );
    expectValid(
      "function ProfileCard() { return <ProfileForm {...profile.formProps}><Card><ProfileFormContent /><ProfileFormFooter><ProfileButton /><SignOutButton /></ProfileFormFooter></Card></ProfileForm>; } export { ProfileCard };",
    );
  });

  it("enforces fixed submit and sign-out button types after prop spreads", () => {
    const submit = "src/app/(protected)/profile/_components/profile-button.tsx";
    const signOut = "src/app/(protected)/profile/_components/sign-out-button.tsx";
    expectValid(
      'function ProfileButton() { return <Button {...props} type="submit" disabled={disabled} />; } export { ProfileButton };',
      submit,
    );
    expectInvalid(
      'function ProfileButton() { return <Button type="submit" disabled={disabled} {...props} />; } export { ProfileButton };',
      /enforce type="submit"/,
      submit,
    );
    expectValid(
      'function SignOutButton() { return <Button {...props} type="button" disabled={disabled} />; } export { SignOutButton };',
      signOut,
    );
    expectInvalid(
      'function SignOutButton() { return <Button type="button" disabled={disabled} {...props} />; } export { SignOutButton };',
      /enforce type="button"/,
      signOut,
    );
    expectInvalid(
      'function SignOutButton() { return <Button {...props} type="submit" disabled={disabled} />; } export { SignOutButton };',
      /enforce type="button"/,
      signOut,
    );
  });

  it("prevents nested forms and submits outside the profile footer", () => {
    expectValid(
      "function ProfileCard() { return <ProfileForm><Card><ProfileFormContent /><ProfileFormFooter><ProfileButton /><SignOutButton /></ProfileFormFooter></Card></ProfileForm>; } export { ProfileCard };",
    );
    expectInvalid(
      "function ProfileCard() { return <ProfileForm><Card><ProfileFormContent /><ProfileFormFooter><ProfileButton type=\"submit\" /><SignOutButton /></ProfileFormFooter></Card></ProfileForm>; } export { ProfileCard };",
      /ProfileButton must not accept an override/,
    );
    expectInvalid(
      "function ProfileCard() { return <ProfileForm><Card><ProfileFormContent /><form /><ProfileFormFooter><ProfileButton /><SignOutButton /></ProfileFormFooter></Card></ProfileForm>; } export { ProfileCard };",
      /Do not nest an HTML form/,
    );
    expectInvalid(
      "function ProfileCard() { return <Card><ProfileForm><ProfileFormContent /><ProfileFormFooter><ProfileButton /><SignOutButton /></ProfileFormFooter></ProfileForm></Card>; } export { ProfileCard };",
      /ProfileFormContent must be inside/,
    );
    expectInvalid(
      "function ProfileCard() { return <ProfileForm><Card><ProfileFormContent /><ProfileButton /><ProfileFormFooter><SignOutButton /></ProfileFormFooter></Card></ProfileForm>; } export { ProfileCard };",
      /ProfileButton must be inside ProfileFormFooter/,
    );
  });

  it("keeps FieldGroup in ProfileFormContent rather than ProfileForm", () => {
    const form = "src/app/(protected)/profile/_components/profile-form.tsx";
    const content = "src/app/(protected)/profile/_components/profile-form-content.tsx";
    expectValid(
      "function ProfileForm() { return <FormProvider><form>{children}</form></FormProvider>; } export { ProfileForm };",
      form,
    );
    expectInvalid(
      "function ProfileForm() { return <FormProvider><form><FieldGroup /></form></FormProvider>; } export { ProfileForm };",
      /delegate fields and actions/,
      form,
    );
    expectValid(
      "function ProfileFormContent() { return <CardContent><FieldGroup>{children}</FieldGroup></CardContent>; } export { ProfileFormContent };",
      content,
    );
    expectInvalid(
      "function ProfileFormContent() { return <CardContent>{children}</CardContent>; } export { ProfileFormContent };",
      /wrap FieldGroup/,
      content,
    );
  });
});
