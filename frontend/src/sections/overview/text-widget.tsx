import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/material/styles';

type Props = {
  title: string;
  value: string | number;
  sx?: SxProps;
};
export function TextWidget({ title, value, sx }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{ height: 150, width: 300, p: 2, m: 1, borderRadius: 5, ...sx }}
    >
      <CardHeader title={title} sx={{ p: 0, fontSize: '0.5rem', ...sx }} />
      <CardContent>
        <Typography variant="h3" sx={{ textAlign: 'right' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
