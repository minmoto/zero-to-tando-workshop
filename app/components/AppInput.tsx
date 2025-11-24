interface AppInputProps {
    amount?: string;
    phoneNumber?: string;
    bankName?: string;
    bankAccountNumber?: string;
    cardNumber?: string;
}


export const AppInput = () => {
    // const mode = 'mobileMoney' | 'bankPayment' | 'cardPayment'

    return (
        <div>
            Hello
        </div>
    )
}

export const bankInput = ({ amount, bankName, bankAccountNumber }: AppInputProps) => {
    return (
        <div>

        </div>
    )
}