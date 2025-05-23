export default class OrdersUtils {
    static deliveryOptions = [
        { id: "pickup", name: 'Pick Up' },
        { id: "shipping", name: 'Shipping' },
    ]

    static statusOptions = [
        { id: "pending", name: 'Pending' },
        { id: "completed", name: 'Completed' },
        { id: "canceled", name: 'Canceled' },
    ]

    static paymentStatusOptions = [
        { id: "pending", name: 'Pending' },
        { id: "notPaid", name: 'Not Paid' },
        { id: "paid", name: 'Paid' },
        { id: "refund", name: 'Refund' },
    ]
}