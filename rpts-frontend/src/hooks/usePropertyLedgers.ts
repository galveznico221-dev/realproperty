import { useQuery } from "@tanstack/react-query";
import { treasuryApi } from "../services/treasuryApi";

export const usePropertyLedgers = (propertyAccountId: number | null, page = 0) => {
    return useQuery({
        queryKey: ['ledgers', propertyAccountId, page],
        //queryfn its like fetch
        //syntax :
        //queryfn : () => method from api() ,
        queryFn: () => treasuryApi.getLedgers(propertyAccountId!, page),
        //enabled is used if no property account has been selected yet
        enabled: propertyAccountId !== null,
    })
}

export const usePropertySearch = (ownerName: string, page = 0) => {
    return useQuery({
        queryKey: ['properties', ownerName, page],
        queryFn: () => treasuryApi.searchProperties(ownerName!, page),
        enabled: ownerName?.trim().length >= 2,
    })
}