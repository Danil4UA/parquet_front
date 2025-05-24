export default class OrdersUtils {
    static deliveryOptions = [
        { id: "pickup", name: 'Pick Up', color: 'bg-blue-100 text-blue-800 border-blue-200'},
        { id: "shipping", name: 'Shipping', color: 'bg-purple-100 text-purple-800 border-purple-200'},
    ]

    static statusOptions = [
        { id: "pending", name: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200'},
        { id: "completed", name: 'Completed', color: 'bg-green-100 text-green-800 border-green-200'},
        { id: "canceled", name: 'Canceled', color: 'bg-red-100 text-red-800 border-red-200'},
    ]

    static paymentStatusOptions = [
        { id: "pending", name: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        { id: "notPaid", name: 'Not Paid', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        { id: "paid", name: 'Paid', color: 'bg-green-100 text-green-800 border-green-200', },
        { id: "refund", name: 'Refund', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    ]
}