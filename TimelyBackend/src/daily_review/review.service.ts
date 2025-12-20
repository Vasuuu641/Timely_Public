import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDailyReviewDto, UpdateDailyReviewDto } from "./dto/review.dto";

@Injectable()

export class DailyReviewService
{
    
    constructor(private prisma : PrismaService) {}


    async create(dto: CreateDailyReviewDto, userId : string)
     {

        const{date, reflection, rating} = dto;
        return this.prisma.dailyReview.create({
            data : {
                date: date ? new Date(date) : new Date(),
                reflection,
                rating,
                user : {
                    connect : {id : userId},
                }
            },
        });

    }

    getTodayReview(userId : string)
    {

        const today = new Date().toISOString().split('T')[0];

        return this.prisma.dailyReview.findFirst({
            where : {
                userId,
                date : {
                    gte : new Date(today + 'T00:00:00.000Z'),
                    lte : new Date(today + 'T23:59:59.999Z'),
                },
            },
        });

    }

    getReviewHistory(userId : string, skip? : number, take? : number)
    {

        return this.prisma.dailyReview.findMany({
            where : {
                userId,
            },

            orderBy : {
                date : 'desc',
            },

            skip : skip?? 0,
            take : take?? 10,


        })

    }

    async updateReview(id : number, userId : string, dto : UpdateDailyReviewDto)
    {

        const review = await this.prisma.dailyReview.findUnique({
            where : {id},
        })

        if(!review)
        {
            throw new NotFoundException('Review Not Found!');

        }

        if(review.userId != userId)
        {
            throw new ForbiddenException('You cannot update this review!');

        }

        return this.prisma.dailyReview.update({
            where: {id}, 
            data : dto,
        });
        
    
    }

    async deleteReview(id : number, userId : string )
    {
        const review = await this.prisma.dailyReview.findUnique({
            where : {id},
        })

        if(!review)
        {
            throw new NotFoundException('Review not found!');
        }

        if(review.userId != userId)
        {

            throw new ForbiddenException('You cannot delete this review');

        }

        return this.prisma.dailyReview.delete({
            where : {id},
        })
    }
}