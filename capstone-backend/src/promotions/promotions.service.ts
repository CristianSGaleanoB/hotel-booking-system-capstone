import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FestiveCalendar } from './entities/festive-calendar.schema';

@Injectable()
export class PromotionsService {
    constructor(
        @InjectModel(FestiveCalendar.name) private readonly festiveModel: Model<FestiveCalendar>,
    ) {}

    async applyPromotions( data: { adultCount: number, childCount: number,
        city: string, startDate: Date, endDate: Date, basePrice: number}) {
            let totalDiscountMoney = 0;
            let totalDiscountPercentage = 0;
            let promotionsApplied: string[] = [];

            if (data.childCount > 0 ) {
                const totalPeople = data.adultCount + data.childCount;
                const pricePerPerson = data.basePrice / totalPeople;
                const kidsDiscount = pricePerPerson * data.childCount;

                totalDiscountMoney += kidsDiscount;
                promotionsApplied.push(`Kids Discount (${data.childCount} kids)`);
            }
            
            if(data.adultCount > 8) {
                totalDiscountPercentage += 0.10;
                promotionsApplied.push(`Group Discount (10%)`);
            }

            const festive = await this.festiveModel.findOne({
                city: data.city,
                startDate: {
                    $gte: data.startDate,
                    $lte: data.endDate
                }
            })

            if(festive) {
                totalDiscountPercentage += festive.discountPercentage / 100;
                promotionsApplied.push(`Festive Discount (${festive.name})`);
            }

            const discountFromPercentage = data.basePrice * totalDiscountPercentage;
            const finalPrice = data.basePrice - discountFromPercentage - totalDiscountMoney;

            return {
                finalPrice: finalPrice < 0 ? 0 : finalPrice,
                totalDiscount: discountFromPercentage + totalDiscountMoney,
                promotionsApplied
            }

        }
}
