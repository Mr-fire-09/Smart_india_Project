import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface RatingComponentProps {
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting: boolean;
}

export function RatingComponent({ onSubmit, isSubmitting }: RatingComponentProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <Card data-testid="card-rating">
      <CardHeader>
        <CardTitle className="font-heading">Rate Your Experience</CardTitle>
        <CardDescription>
          Help us improve our services by sharing your feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2" data-testid="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
                data-testid={`star-${star}`}
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Additional Comments (Optional)
          </label>
          <Textarea
            id="comment"
            placeholder="Share your experience with the application process..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="resize-none"
            data-testid="textarea-comment"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full"
          data-testid="button-submit-rating"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardFooter>
    </Card>
  );
}
