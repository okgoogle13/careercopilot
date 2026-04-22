# Spec: ApplicationForm

## TypeScript Interface
```typescript
interface ApplicationFormProps {
  onUpload: (file: File) => void;
  acceptedFormats?: string[]; // Default: ['.pdf', '.doc', '.docx']
  isVerifying?: boolean;
}
```

## State Management
- **Upload State**: Progress percentage for the blueprint fade effect.
- **Verification State**: Result of the document analysis.

## Accessibility Spec
- **ARIA Roles**: `role="form"`, `aria-describedby` for drop instructions.
- **Keyboard**: Full support for `Enter` and `Space` to trigger the file picker.

## Design Token Mapping
- **DropZone**: `p-12`, `border-2`, `border-[#2a2a2a]`, `hover:border-[#F14714]`
- **Text**: `text-center`, `uppercase`, `tracking-tighter`
- **Success**: `text-[#DAF674]`, `motion-safe:animate-bounce-in`

## Test Stubs
```javascript
test('triggers onUpload when file is dropped', () => {
  const uploadSpy = jest.fn();
  render(<ApplicationForm onUpload={uploadSpy} />);
  const file = new File(['hello'], 'resume.pdf', { type: 'application/pdf' });
  const dropZone = screen.getByText(/DROP PDF HERE/i);
  fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
  expect(uploadSpy).toHaveBeenCalledWith(file);
});
```
