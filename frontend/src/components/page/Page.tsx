import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  name?: string;
  children: React.ReactNode;
};
export default function Page({ name, children }: Props) {
  return (
    <>
      <Container>
        {name && (
          <Stack>
            <Typography variant="h3" gutterBottom>
              {name}
            </Typography>
          </Stack>
        )}
        <Card>{children}</Card>
      </Container>
    </>
  );
}
