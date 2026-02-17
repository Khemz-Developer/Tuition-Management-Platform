import { Barcode, Layers, ShoppingCart, Star, Tag } from 'lucide-react';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreClient } from '../context';

interface ICard3Props {
  badge?: boolean;
  logo: string;
  title: string;
  total: string;
  star: string;
  label?: string;
  sku?: string;
  category1?: string;
  category2?: string;
  badgeLabel?: string;
}

export function Card3({
  badge,
  logo,
  title,
  badgeLabel,
  sku,
  total,
  star,
  label,
  category1,
  category2,
}: ICard3Props) {
  const { showCartSheet, showProductDetailsSheet } = useStoreClient();
  const safeBadgeLabel = badgeLabel ?? '40';

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-start gap-3.5">
          <Card className="flex items-center justify-center bg-accent/50 h-[80px] w-[100px] shadow-none rounded-lg overflow-hidden">
            <img
              onClick={() => showProductDetailsSheet('productid')}
              src={toAbsoluteUrl(`/media/store/client/600x600/${logo}`)}
              className="h-[80px] cursor-pointer object-contain"
              alt="image"
            />
          </Card>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <Link
                to="#"
                className="hover:text-primary text-xs font-normal text-secondary-foreground sm:text-sm sm:font-medium sm:text-mono leading-5.5"
                onClick={() => showProductDetailsSheet('productid')}
              >
                {title}
              </Link>

              {badge && (
                <Badge size="sm" variant="destructive" className="uppercase">
                  save {safeBadgeLabel}%
                </Badge>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <Badge
                size="sm"
                variant="warning"
                shape="circle"
                className="rounded-full gap-1"
              >
                <Star
                  className="text-white -mt-0.5"
                  style={{ fill: 'currentColor' }}
                />{' '}
                {star}
              </Badge>

              <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
                {sku && (
                  <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1">
                    <Barcode className="h-3.5 w-3.5" />
                    <span className="text-foreground font-medium">{sku}</span>
                  </div>
                )}
                {category1 && (
                  <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="text-foreground font-medium">
                      {category1}
                    </span>
                  </div>
                )}
                {category2 && (
                  <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1">
                    <Layers className="h-3.5 w-3.5" />
                    <span className="text-foreground font-medium">
                      {category2}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <div className="flex items-center gap-1.5">
            {label && (
              <span className="text-xs font-normal text-secondary-foreground line-through">
                {label}
              </span>
            )}
            <span className="text-sm font-medium text-mono">${total}</span>
          </div>
          <Button
            variant="outline"
            className="sm:ms-2 shrink-0"
            onClick={showCartSheet}
          >
            <ShoppingCart /> Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
