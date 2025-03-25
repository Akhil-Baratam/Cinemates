import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { formatPrice } from "../../../utils/formatters";

const Ad = ({ ad }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden">
        {/* Image Section */}
        {ad.imgs?.[0] && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={ad.imgs[0].url} 
              alt={ad.productName}
              className="w-full h-full object-cover"
            />
            {ad.isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">SOLD</span>
              </div>
            )}
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-2">{ad.productName}</CardTitle>
            <span className="text-lg font-bold">{formatPrice(ad.price, ad.currency)}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{ad.category}</Badge>
            <Badge variant="outline" className="bg-muted">
              {ad.condition}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {ad.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {ad.tags?.map((tag, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>Location: {ad.location}</p>
            <p>{ad.views} views</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Ad;